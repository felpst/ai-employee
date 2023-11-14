import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { SerpAPI } from 'langchain/tools';
import { WebBrowserTool } from '../web-browser.tool';


describe('Python Tool Test', () => {


  const model = new ChatModel();
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY),
    new WebBrowserTool(model),
  ];


  it('should return corrects information of the site', async () => {

    const executor = await initializeAgentExecutorWithOptions(
      tools,
      model,
      {
        agentType: 'zero-shot-react-description',
      }
    );
    const input = `What is the 10th fibonacci number?`;
    const result = await executor.call({ input });
    expect(result.output).toContain("34");
  })
});