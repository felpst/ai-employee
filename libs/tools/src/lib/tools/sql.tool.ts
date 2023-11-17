import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class SQLTool extends DynamicTool {
  constructor() {
    super({
      name: 'SQL Tool',
      description:
        'Use this tool to acess the database and get information on the database. Input should be a task instruction to executor.',
      func: async (input: string) => {
        const { data } = await axios.post(process.env.SQL_TOOL_URL, { input_text: input });
        return data.result;
      },
    });
  }
}
