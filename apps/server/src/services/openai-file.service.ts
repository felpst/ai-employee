import fs from 'fs';
import OpenAI from 'openai';

export default class OpenAIFileService {
  private _client: OpenAI.Files;
  constructor() {
    this._client = new OpenAI().files;
  }

  async create(fileName: string, content: string | Buffer) {
    const filePath = process.env.PROD === 'true'
      ? `/tmp/${fileName}`
      : `tmp/${fileName}`;

    fs.writeFileSync(filePath, content);

    return this._client.create({
      file: fs.createReadStream(filePath),
      purpose: 'assistants'
    });
  }

  async delete(fileId: string) {
    return this._client.del(fileId);
  }
}
