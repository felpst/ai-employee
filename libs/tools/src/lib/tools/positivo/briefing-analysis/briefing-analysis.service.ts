import { Audiences } from './briefing-analysis.interface';
import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FileManagerService } from '../../file-manager';

export class BriefingAnalysisService {
  async analyze(briefing: string, data: Audiences[], aiEmployeeId: string, qt: number = 50, briefingFileName?: string, audienceFileName?: string): Promise<string> {
    const fileManagerService = new FileManagerService();

    const datat = await (fileManagerService.read({ aiEmployeeId, filename: audienceFileName }))
    const briefingt = await fileManagerService.read({ aiEmployeeId, filename: briefingFileName })

    console.log('audience', datat)
    console.log('briefing', briefingt)

    const briefingSumary = await this.getBriefingSumary(briefing)

    console.log('creating documents...')

    const docs: Document[] = []
    
    for (let i = 0; i < data.length; i++) {
      docs.push(new Document({ pageContent: JSON.stringify(data[i]), metadata: { index: i } }))
    }

    console.log('save documents...', docs.length)
    
    const vectorStore = await MemoryVectorStore.fromTexts(
      docs.map(doc => doc.pageContent),
      docs.map(doc => doc.metadata),
      new EmbeddingsModel()
    );

    console.log('start analysis...')
    
    const prompt = `Which audience is best suited for advertising to the following audience: \n${briefingSumary}`

    const audienceAnalysis = await vectorStore.similaritySearch(prompt, qt);

    const file = await this.saveFile(audienceAnalysis, data, aiEmployeeId)

    return `Analysis complete: saved in file ${file}.`;
  }

  private getFileName(): string {
    const date = new Date();
    return `analysis${date.getFullYear()}${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}.txt`;
  }

  private async getBriefingSumary(briefing: string): Promise<string> {
    const model = new ChatModel();
    console.log('get briefing content...')

    const { content } = await model.invoke(`Get the Age, Sex, Profession, Interests, City, state
    and Country informations from the briefing: ${briefing}`)

    return <string>content
  }

  private async saveFile(audienceAnalysis: Document[], data: Audiences[], aiEmployeeId: string) {
    console.log('saving file...')
    const result = []
    
    for(const analysis of audienceAnalysis) {
      result.push(JSON.stringify(data[analysis.metadata.index]))
    }

    const filename = this.getFileName()
    const file = new File(result, filename)

    const fileManagerService = new FileManagerService();

    return await fileManagerService.create({ aiEmployeeId, file })
  }
}