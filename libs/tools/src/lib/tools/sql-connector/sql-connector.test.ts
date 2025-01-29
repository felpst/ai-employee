import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { SQLConnectorToolSettings } from './sql-connector.interfaces';
import { SQLConnectorTool } from './sql-connector.tool';

describe('SQLConnectorTool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const settings: SQLConnectorToolSettings = {
      database: 'postgresql',
      host: '34.67.95.96',
      name: 'postgres',
      port: '5432',
      auth: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
      }
    }
    const tools = [
      new SQLConnectorTool(settings),
    ];
    executor = await agentTest(tools);
  });

  it('should list all tables of database', async () => {
    const result = await executor.call({ input: 'List all tables on database' });
    const answer = (result.output as string).toLowerCase()
    console.log(answer)
    expect(answer).toContain('people');
  })

  it('should retrieve specific data', async () => {
    const result = await executor.call({ input: 'What is Linecker\'s email?' });
    const answer = (result.output as string).toLowerCase()
    console.log(answer)
    expect(answer).toContain('linecker@cognum.ai');
  })

  it('should retrieve specific data and manage to answer', async () => {
    const result = await executor.call({ input: 'How old is linecker?' });
    const answer = (result.output as string).toLowerCase()
    console.log(answer)
    expect(answer).toContain('31');
  })

});
