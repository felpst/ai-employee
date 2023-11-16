import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { PythonTool } from '../tools/python.tool';


describe('Python Tool Test', () => {


  const model = new ChatModel();
  const tools = [
    new PythonTool()
  ];


  it('should return correct 10th fibonnaci number', async () => {

    const executor = await initializeAgentExecutorWithOptions(
      tools,
      model,
      {
        agentType: 'zero-shot-react-description',
      }
    );
    const input = `What is the 10th fibonacci number?`;
    const result = await executor.call({ input });
    expect(result.output).toContain("34");
  })
});