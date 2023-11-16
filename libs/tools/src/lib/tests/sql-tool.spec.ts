import { ChatModel } from '@cognum/llm';
import {
    initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { SQLTool } from '../tools/sql.tool';


describe('Python Tool Test', () => {


    const model = new ChatModel();
    const tools = [
        new SQLTool()
    ];


    it('should return corrects information of the site', async () => {

        const executor = await initializeAgentExecutorWithOptions(
            tools,
            model,
            {
                agentType: 'zero-shot-react-description',
            }
        );
        const input = `Who are the top 3 best selling artists?`;
        const result = await executor.call({ input });
        expect(result.output).toContain("34");
    })
});