import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { WebBrowser } from '../../web-browser';
import { InternetResearchTool } from '../intenet-research.tool';
import { SearchApiToolSettings } from '../internet-research.interface';

describe('Extract Content Tool test', () => {
    jest.setTimeout(3000000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
      const settings: SearchApiToolSettings = {
        API_KEY: process.env.SERPAPI_API_KEY
      }
      const tools = [
        new InternetResearchTool(settings)
      ];
      executor = await agentTest(tools);
    });

    it('click on microsoft login button', async () => {
        const inputText = 'what are emerging technologies in 2023 ?';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('technologies in 2023');
    })

});
