import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { GoogleCalendarCreateEventTool } from '../google-calendar-create-event.tool';


describe('GoogleCalendarTools test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
        const token = "ya29.a0AfB_byBM8nXThCVR1yAisO6ql1Oe5j2EVjMIbFQQm9BiuX8NVbRT2_a8hCaFtAR2hvEc7x2ys191YNZyJy04Q1jOStoMuRLd0LVD0sza45Xit5-bAhHi1ynRpQz0O1iwqioQMcxmTMzydYBIgclcgISIjSd0JWUq0YIaCgYKAQkSARMSFQHGX2MiYgwECN9xLp7pXmMOCIYr1w0170"
        const tools = [
            new GoogleCalendarCreateEventTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const inputText = 'Create an event for December 10th that starts at 10 am and ends at 2 pm with timezone of São Paulo with the title Cognum Update and the description of a weekly update meeting, invite the following emails to this event devrenatorodrigues@gmail.com and rehrlz@gmail.com';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('has been successfully created ')
    })

});
