import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class SQLTool extends DynamicTool {
  constructor() {
    super({
      name: 'SQL Tool',
      description:
        'Use this when you need search informations you dont know and you dont find in chat history, but possible to find in database. Input should be a question.',
      func: async (input: string) => {
        const response = await axios.post(process.env.SQL_TOOL_URL, { input });

        return response.data;
      },
    });
  }
}
