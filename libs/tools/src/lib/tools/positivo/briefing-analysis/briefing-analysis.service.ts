import { Audiences } from './briefing-analysis.interface';
import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FileManagerService } from '../../file-manager';

export class BriefingAnalysisService {
  async analyze(briefingFileName: string, audienceFileName: string, aiEmployeeId: string, qt: number = 50): Promise<string> {

    const briefing = await this.getDataFromFile(briefingFileName, aiEmployeeId);
    const audienceData = await this.getDataFromFile(audienceFileName, aiEmployeeId);

    const briefingSumary = await this.getBriefingSumary(briefing);
    const audiences: Audiences[] = JSON.parse(audienceData);

    console.log('creating documents...');

    const docs: Document[] = [];

    for (let i = 0; i < audiences.length; i++) {
      docs.push(new Document({ pageContent: JSON.stringify(audiences[i]), metadata: { index: i } }));
    }

    console.log('save documents...', docs.length);

    const vectorStore = await MemoryVectorStore.fromTexts(
      docs.map(doc => doc.pageContent),
      docs.map(doc => doc.metadata),
      new EmbeddingsModel()
    );

    console.log('start analysis...');

    const prompt = `Which audience is best suited for advertising to the following audience: \n${briefingSumary}`;

    const audienceAnalysis = await vectorStore.similaritySearch(prompt, qt);

    const file = await this.saveFile(audienceAnalysis, audiences, aiEmployeeId);

    return `Analysis complete: saved in file ${file}.`;
  }

  private async getDataFromFile(filename: string, aiEmployeeId: string) {
    console.log('reading file...');

    const fileManagerService = new FileManagerService();
    const fileResponse = await fileManagerService.read({ aiEmployeeId, filename });

    const { contentType, data, lastModified, name } = fileResponse;
    const binaryString = Buffer.from(data, 'base64');
    const blob = new Blob([binaryString], {
      type: 'application/octet-stream',
    });
    const file = new File([blob], name, {
      type: contentType,
      lastModified: new Date(lastModified).getTime(),
    });

    return await file.text();
  }

  private async getBriefingSumary(briefing: string): Promise<string> {
    const model = new ChatModel();
    console.log('get briefing content...');

    const { content } = await model.invoke(`Get the Age, Sex, Profession, Interests, City, state
    and Country informations from the briefing: ${briefing}`);

    console.log('briefing content: ', content);

    return <string>content;
  }

  private async saveFile(audienceAnalysis: Document[], data: Audiences[], aiEmployeeId: string) {
    console.log('saving file...');
    const result = [];

    for (const analysis of audienceAnalysis) {
      result.push(JSON.stringify(data[analysis.metadata.index]));
    }

    const file = new File(result, 'analysis.txt');

    const fileManagerService = new FileManagerService();

    return await fileManagerService.create({ aiEmployeeId, file });
  }
}
