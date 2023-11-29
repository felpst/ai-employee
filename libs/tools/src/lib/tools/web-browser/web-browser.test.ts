import 'dotenv/config';
import { agentTest } from '../../tests/agent-test';
import { WebBrowserTool } from './web-browser.tool';

describe('Random tool test', () => {
  jest.setTimeout(300000)
  let executor = null;

  beforeAll(async () => {
    const tools = [
      new WebBrowserTool(),
    ];
    executor = await agentTest(tools);
  });

  it('should access wikipedia page and get information', async () => {
    const result = await executor.call({ input: 'Quando ocorreu as invasões bárbaras? https://pt.wikipedia.org/wiki/Alb%C3%A2nia' });
    console.log(result.output);
    expect(result.output).toContain('III');
  })

});
