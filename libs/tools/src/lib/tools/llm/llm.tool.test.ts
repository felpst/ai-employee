import 'dotenv/config';
import { LlmTool } from './llm.tool';
import { agentTest } from '../../tests/agent-test';

describe('LLM tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const tools = [
      new LlmTool(),
    ];
    executor = await agentTest(tools, true);
  });

  it('temperature of saturn is', async () => {
    const result = await executor.call({ input: 'ask llm what the temperature of saturn is' });
    expect(result.output).toContain('-178 degrees Celsius');
  })

});
