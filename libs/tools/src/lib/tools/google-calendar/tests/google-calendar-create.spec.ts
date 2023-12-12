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
        const token = "ya29.a0AfB_byBGznCLVHmHU1NEHAwXTvoCUdIKL47oI1ViLc4QRpl_4YYEEuMArrL9Y3HtMYiVHQHfzR4c15C9bSJuGEYgsWNlu5swY1nuP93WDqyHP9H36voJQEMJiGHzBHIC0XF-GG1vEc2g48_SG2XXUFBC3Azd_KfOgU8aCgYKAcUSARMSFQHGX2MiuU8ZinU869oZ5sGCDO-KJg0170"
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
