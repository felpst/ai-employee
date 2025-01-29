import { DatabaseHelper } from '@cognum/helpers';
import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { SerpAPI } from '@langchain/core/tools';
import mongoose from 'mongoose';
import { WebBrowserTool } from '../tools/web-browser/web-browser.tool';


describe('WebBrowser Tool Test', () => {

  beforeEach(async () => {
<<<<<<< HEAD
    await DatabaseHelper.connect(process.env.MONGO_URL);
=======
    await DatabaseHelper.connect();
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

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
    const input = `https://www.historyextra.com/period/second-world-war/1942-churchill-darkest-hour-reputation-public-opinion/`;
    const result = await executor.call({ input });
    expect(result.output).toContain("I was unable to find any information about Churchill's reputation during the Second World War in 1942.");
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
