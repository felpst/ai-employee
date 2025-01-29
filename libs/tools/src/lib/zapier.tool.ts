import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions,
  ZapierToolKit,
} from 'langchain/agents';
import { DynamicTool, ZapierNLAWrapper } from 'langchain/tools';

export class ZapierTool extends DynamicTool {
  constructor() {
    super({
      name: 'Google Spreadsheets',
      description:
        'Use to access Google Spreadsheets files. Input should be a task instruction to executor.',
      // TODO: especificar na descrição as ferramentas disponíveis
      func: async (input: string) => {
        console.log('------------ZapierTool------------');

        const model = new ChatModel({
          temperature: 0,
          verbose: true,
        });
        const zapier = new ZapierNLAWrapper();
        const toolkit = await ZapierToolKit.fromZapierNLAWrapper(zapier);

        const executor = await initializeAgentExecutorWithOptions(
          toolkit.tools,
          model,
          {
            agentType: 'zero-shot-react-description',
            verbose: true,
          }
        );

        const result = await executor.call({ input });
        console.log(`Got output ${result.output}`);
        console.log('------------ZapierTool------------');
        return result.output;
      },
    });
  }
}
