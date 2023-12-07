import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { GoogleCalendarDeleteEventTool } from '../google-calendar-delete-event.tool';


describe('GoogleCalendarTools test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;

    beforeAll(async () => {
        const token = "ya29.a0AfB_byCmIur3s22RK2RhZGlfkZrZl_iNNuIAeLhmczxcdfJacR4mZdAxDMQCmhSUqSSkyk5Kg8FG31eQaQiMMA_gmch8lcEhcvodxDIEjr0Ev7E9ePrPgsHf0hgAFdqb8SFoiK1LCf4KZe-bL_OpoUZhNQloCLpI-boaCgYKAfoSARMSFQHGX2MiE_Xkgfrz2PamgMyNiHfeWA0170"
        const tools = [
            new GoogleCalendarDeleteEventTool(token)
        ];
        executor = await agentTest(tools);
    });

    it('should return list of events', async () => {
        const inputText = 'Delete an event for December 10th that starts at 11 am and ends at 5 pm with the title Cognum News and the description of a weekly update meeting';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('Event updated successfully')
    })

});
