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
        const token = "ya29.a0AfB_byCSsE76jRGa1IC-4RTI9iqxPijt-jywZJIDcXTxX5hXjKw-hzYUMAoHWcxX19HpCsyXZGwo-xFTXT36NuNTH0WhlNEBAnhpURTEWkAqjFprglBxdr3XOUP8XAAdY3LcGvbY88nipxyoN4WPdzDVmdBuaYAjwL0aCgYKAXgSARMSFQHGX2MihtyexKnQ-UYzLN-CmrFXtA0170"
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
