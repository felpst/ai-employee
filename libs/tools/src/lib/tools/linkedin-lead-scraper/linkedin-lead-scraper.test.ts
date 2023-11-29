import 'dotenv/config';
import {
  AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../tests/agent-test';
import { LinkedInLeadScraperToolSettings } from './linkedin-lead-scraper.interfaces';
import { LinkedInLeadScraperTool } from './linkedin-lead-scraper.tool';

describe('LinkedInLeadScraperTool test', () => {
  jest.setTimeout(300000)
  let executor!: AgentExecutor;

  beforeAll(async () => {
    const settings: LinkedInLeadScraperToolSettings = {
      user: process.env.LINKEDIN_USERNAME,
      password: process.env.LINKEDIN_PASSWORD
    }
    const tools = [
      new LinkedInLeadScraperTool(settings),
    ];
    executor = await agentTest(tools);
  });

  it('should return list of leads', async () => {
    const result = await executor.call({ input: 'Get Web Developers Leads from Brazil' });
    console.log(result.output);
    expect(result.output).toContain('Here are some leads')
  })

});
