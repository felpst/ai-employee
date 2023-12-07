import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../tests/agent-test';
import { GoogleCalendarListEventsTool } from './google-calendar-list-events.tool';


describe('LinkedInLeadScraperTool test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
        const token = "ya29.a0AfB_byCmIur3s22RK2RhZGlfkZrZl_iNNuIAeLhmczxcdfJacR4mZdAxDMQCmhSUqSSkyk5Kg8FG31eQaQiMMA_gmch8lcEhcvodxDIEjr0Ev7E9ePrPgsHf0hgAFdqb8SFoiK1LCf4KZe-bL_OpoUZhNQloCLpI-boaCgYKAfoSARMSFQHGX2MiE_Xkgfrz2PamgMyNiHfeWA0170"
        const tools = [
            new GoogleCalendarListEventsTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of leads', async () => {
        const result = await executor.call({ input: 'Get the next 30 events in my google calendar and order by start time' });
        console.log(result.output);
        expect(result.output).toContain('Here are some leads')
    })

});
