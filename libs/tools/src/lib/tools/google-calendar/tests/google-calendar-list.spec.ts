import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { GoogleCalendarListEventsTool } from '../google-calendar-list-events.tool';


describe('GoogleCalendarTools test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;
    const token = "ya29.a0AfB_byBM8nXThCVR1yAisO6ql1Oe5j2EVjMIbFQQm9BiuX8NVbRT2_a8hCaFtAR2hvEc7x2ys191YNZyJy04Q1jOStoMuRLd0LVD0sza45Xit5-bAhHi1ynRpQz0O1iwqioQMcxmTMzydYBIgclcgISIjSd0JWUq0YIaCgYKAQkSARMSFQHGX2MiYgwECN9xLp7pXmMOCIYr1w0170"

    beforeAll(async () => {
        const tools = [
            new GoogleCalendarListEventsTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const result = await executor.call({ input: 'Get the next 30 events in my google calendar and order by start time' });
        console.log(result.output);
        expect(result.output).toContain('Event list:')
    })

});
