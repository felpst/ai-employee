import fs from 'fs';
import OpenAI from 'openai';

export default class OpenAIFileService {
  private _client: OpenAI.Files;
  constructor() {
    this._client = new OpenAI().files;
  }

  async create(fileName: string, content: string | Buffer) {
    fs.writeFileSync(`tmp/${fileName}`, content);

    return this._client.create({
      file: fs.createReadStream(`tmp/${fileName}`),
      purpose: 'assistants'
    });
  }

  async delete(fileId: string) {
    return this._client.del(fileId);
  }
}