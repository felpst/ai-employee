import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { GoogleCalendarDeleteEventTool } from '../google-calendar-delete-event.tool';
import { GoogleCalendarListEventsTool } from '../google-calendar-list-events.tool';


describe('GoogleCalendarTools test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
        const token = "ya29.a0AfB_byBxhrfBNLqUYXPFgarUaPaFDoaVV5mBeKwacQy427H3Xx2_Iafu2OvaxoRUKo0xFoMnh3bOWBbwTWcNELOlNx28SZb5QTK_EJBXwxh7Iyrti7fuEIFvEjSAKXI0Rwi7spX0eALB318k0L80Lsq5Neh7L0Er0dwaCgYKAYMSARMSFQHGX2MiTI8yjk5KxIFgQhRm6CjeSQ0170"
        const tools = [
            new GoogleCalendarListEventsTool(token),
            new GoogleCalendarDeleteEventTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const inputText = 'Delete the December 10th Cognum Update event.';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('has been successfully deleted')
    })

});
