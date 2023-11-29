import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { LinkedinScraperTool } from './linkedin-scraper.tool';


describe('LinkedinScraper tool test', () => {
  const username = process.env.LINKEDIN_USERNAME;
  const password = process.env.LINKEDIN_PASSWORD;

  const tools = [
    new LinkedinScraperTool(username, password),
  ];
  const model = new ChatModel();


  it('should return data successfully', async () => {

    const executor = await initializeAgentExecutorWithOptions(
      tools,
      model,
      {
        agentType: 'structured-chat-zero-shot-react-description',
        verbose: false,
      }
    );
    const result = await executor.call({ input: 'get 5 person data from linkedin with profession Web Developer' });
    expect(result.output.length).toEqual(5);
  })
});