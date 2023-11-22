import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class SQLTool extends DynamicTool {
  constructor(
    database: string,
    username: string,
    password: string,
    host: string,
    dbPort: string,
    dbName: string
  ) {
    super({
      name: 'SQL Tool',
      description:
        'Use this tool to acess the database and get information on the database. Input should be a task instruction to executor.',
      func: async (input: string) => {
        const { data } = await axios.post(process.env.SQL_TOOL_URL, {
          input_text: input,
          database,
          username,
          password,
          host,
          db_port: dbPort,
          db_name: dbName,
        });
        return data.result;
      },
    });
  }
}
