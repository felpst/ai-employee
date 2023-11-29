import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { SQLConnectorToolSettings } from './sql-connector.interfaces';
import { SQLConnectorTool } from './sql-connector.tool';

describe('SendEmail tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const settings: SQLConnectorToolSettings = {
      database: 'postgree',
      host: '34.67.95.96',
      name: 'cognum:us-central1:chinook',
      port: '',
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

  it('should send email successfully', async () => {
    const result = await executor.call({ input: 'send email to linecker@cognum.ai with a joke' });
    expect(result.output).toContain('successfully');
  })

});
