import * as fs from 'fs';
import OpenAI from 'openai';

export class KnowledgeRetrieverService {
  private _client: OpenAI;
  constructor() {
    this._client = new OpenAI();
  }

  async createFile(fileName: string, content: string | Buffer) {
    const filePath = process.env.PROD === 'true'
      ? `/tmp/${fileName}`
      : `tmp/${fileName}`;

    fs.writeFileSync(filePath, content);

    return this._client.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'assistants'
    });
  }

  async deleteFile(fileId: string) {
    return this._client.files.del(fileId);
  }

  async askToAssistant(input: string, assistantId: string, fileIds: string[]) {
    const thread = await this._client.beta.threads.create();
    await this._client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
      file_ids: fileIds
    });

    const run = await this._client.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      instructions: `You are a smart assistant that retrieves information using your knowledge. Your answer to the questions must be as objective as possible.`,
      tools: [{ type: 'retrieval' }],
      model: "gpt-4-1106-preview"
    });

    // await thread run to complete
    let currentRun: OpenAI.Beta.Threads.Runs.Run =
      await this._client.beta.threads.runs.retrieve(thread.id, run.id);

    let attempts = 0;
    while (currentRun.status !== 'completed') {
      if (attempts > 30) throw new Error('OpenAI assistant run timeout');
      attempts++;
      currentRun = await this._client.beta.threads.runs.retrieve(thread.id, run.id);
      if (['cancelled', 'cancelling', 'failed', 'expired', 'requires_action'].includes(currentRun.status))
        throw new Error(`OpenAI assistant run failed with status "${currentRun.status}"`);
      await new Promise(r => setTimeout(r, 5000)); // avoids half of the requests
    }

    const messages = await this._client.beta.threads.messages.list(thread.id);
    const response = messages.data[0].content[0] as OpenAI.Beta.Threads.Messages.MessageContentText;
    const textRemovedSource = response.text.value.replace(/【.*?】/g, '').trim();

    await this._client.beta.threads.del(thread.id);
    return textRemovedSource;
  }
}
