import { ChatModel } from '@cognum/llm';
import {
    initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { SQLTool } from '../tools/sql.tool';


describe('SQL Tool Test', () => {

    jest.setTimeout(1200000)
    const model = new ChatModel();
    const tools = [
        new SQLTool("postgresql", "renato", "password", "postgres", "5432", "Chinook")
    ]


    it('should return corrects information of the database', async () => {

        const executor = await initializeAgentExecutorWithOptions(
            tools,
            model,
            {
                agentType: 'zero-shot-react-description',
            }
        );
        const input = `Who are the top 3 best selling artists?`;
        const result = await executor.call({ input });
        expect(result.output).toContain("The top 3 best selling artists are Iron Maiden, U2, and Metallica.");
    })
});