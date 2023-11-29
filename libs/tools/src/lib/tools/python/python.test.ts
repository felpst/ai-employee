import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { PythonTool } from './python.tool';

describe('Python tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const tools = [
      new PythonTool(),
    ];
    executor = await agentTest(tools, true);
  });

  it('should calculate fibonacci number', async () => {
    const result = await executor.call({ input: 'What is the 10th fibonacci number?' });
    console.log(result.output);
    expect(result.output).toContain('55');
  })

});
