import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { GoogleCalendarListEventsTool } from '../google-calendar-list-events.tool';
import { GoogleCalendarUpdateEventTool } from '../google-calendar-update-event.tool';


describe('GoogleCalendarTools test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
        const token = "ya29.a0AfB_byBxhrfBNLqUYXPFgarUaPaFDoaVV5mBeKwacQy427H3Xx2_Iafu2OvaxoRUKo0xFoMnh3bOWBbwTWcNELOlNx28SZb5QTK_EJBXwxh7Iyrti7fuEIFvEjSAKXI0Rwi7spX0eALB318k0L80Lsq5Neh7L0Er0dwaCgYKAYMSARMSFQHGX2MiTI8yjk5KxIFgQhRm6CjeSQ0170"
        const tools = [
            new GoogleCalendarUpdateEventTool(token),
            new GoogleCalendarListEventsTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const inputText = 'Update the December 10th Cognum Update event to start at 11am and end at 5pm with timezone of São Paulo and change its title to Cognum News and the description to a weekly update meeting.';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('Event updated successfully')
    })

});
