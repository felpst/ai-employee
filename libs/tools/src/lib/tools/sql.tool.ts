import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class SQLTool extends DynamicTool {
  constructor() {
    super({
      name: 'SQL Tool',
      description:
        'Use this tool to acess the database and get information.',
      func: async (input: string) => {
        const response = await axios.post("https://localhost:3005/sql-tool", { input });
        console.log(`Got output ${response.data}`);
        console.log('------------SQLTool------------');
        return response.data;
      },
    });
  }
}
