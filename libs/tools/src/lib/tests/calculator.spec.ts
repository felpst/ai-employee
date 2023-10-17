import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { OpenAI } from 'langchain/llms/openai';
import { Calculator } from 'langchain/tools/calculator';


describe('Mongo Vector DB tests', () => {
    const tools = [
        new Calculator(),
      ];
    const model = new OpenAI({ temperature: 0, verbose: true });


  it('should add a document to the database', async () => {
  
    const executor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
          agentType: 'zero-shot-react-description',
          verbose: true,
        }
      );
      const result = await executor.call({ input: '1 + 1' });
      expect(result.output).toEqual('1 + 1 = 2');
    })

});