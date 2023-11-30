import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { RandomNumberTool } from './random-number.tool';

describe('Random tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const tools = [
      new RandomNumberTool(),
    ];
    executor = await agentTest(tools);
  });

  it('should generate a number between 5 and 10', async () => {
    const result = await executor.call({ input: 'Generate a random number between 5 and 10.' });
    expect(parseFloat(result.output)).toBeGreaterThanOrEqual(5);
    expect(parseFloat(result.output)).toBeLessThanOrEqual(10);
  })

});
