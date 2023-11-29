import axios from 'axios';
import { DynamicTool } from 'langchain/tools';
import { SQLConnectorToolSettings } from './sql-connector.interfaces';

export class SQLConnectorTool extends DynamicTool {
  constructor(
    settings: SQLConnectorToolSettings
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
          username: settings.auth.user,
          password: settings.auth.pass,
          host: settings.host,
          db_port: settings.port,
          db_name: settings.name,
        });
        return data.result;
      },
    });
  }
}
