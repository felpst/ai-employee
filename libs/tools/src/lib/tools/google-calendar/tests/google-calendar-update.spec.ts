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
        const token = "ya29.a0AfB_byBGznCLVHmHU1NEHAwXTvoCUdIKL47oI1ViLc4QRpl_4YYEEuMArrL9Y3HtMYiVHQHfzR4c15C9bSJuGEYgsWNlu5swY1nuP93WDqyHP9H36voJQEMJiGHzBHIC0XF-GG1vEc2g48_SG2XXUFBC3Azd_KfOgU8aCgYKAcUSARMSFQHGX2MiuU8ZinU869oZ5sGCDO-KJg0170"
        const tools = [
            new GoogleCalendarUpdateEventTool(token),
            new GoogleCalendarListEventsTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const inputText = 'Update the December 10th Cognum News event to start at 11am and end at 5pm with timezone of São Paulo and change its title to Cognum General Update and the description to a weekly update meeting.';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('has been successfully')
    })

});
