import axios from 'axios';
import { DynamicTool } from 'langchain/tools';
import { SQLToolSettings } from './sql-connector.interfaces';

export class SQLTool extends DynamicTool {
  constructor(
    settings: SQLToolSettings
  ) {
    super({
      name: 'SQL Tool',
      metadata: {
        id: "sql-connector"
      },
      description:
        'Use this tool to acess the database and get information on the database. Input should be a task instruction to executor.',
      func: async (input: string) => {
        const { data } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/sql-connector`, {
          input_text: input,
          database: settings.database,
          username: settings.auth.username,
          password: settings.auth.password,
          host: settings.host,
          db_port: settings.port,
          db_name: settings.name,
        });
        return data.result;
      },
    });
  }
}
