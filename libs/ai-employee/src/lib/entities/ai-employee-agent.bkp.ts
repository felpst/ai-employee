// import { IAIEmployee } from '@cognum/interfaces';
// import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
// import { LLMChain } from 'langchain/chains';
// import { Callbacks } from 'langchain/dist/callbacks';
// import { AIEmployeeModelHelper } from '../helpers/ai-employee-model.helper';
// import { AgentPrompt } from '../modules';
// import { AIEmployeeTools } from '../tools/ai-employee-tools';

// export class AIEmployeeAgent {
//   private _executor: AgentExecutor;

//   constructor(
//     private aiEmployee: IAIEmployee,
//     private callbacks?: Callbacks
//   ) {
//     this.init();
//   }

//   init() {
//     const llm = AIEmployeeModelHelper.chatModel(this.callbacks);
//     const agentPrompt = new AgentPrompt(this.aiEmployee);
//     const prompt = agentPrompt.format();
//     const llmChain = new LLMChain({ llm, prompt });

//     const agent = new LLMSingleActionAgent({
//       llmChain,
//       outputParser: agentPrompt.agentOutputParser(),
//       stop: ['\nObservation'],
//     });

//     const tools = AIEmployeeTools.get(this.aiEmployee.tools);
//     this._executor = new AgentExecutor({
//       agent,
//       tools
//     });
//     console.log('Loaded agent.');
//   }

//   async call(input: string, callbacks?: Callbacks | any) {
//     const chainValues = await this._executor.call({ input }, callbacks);
//     const response = chainValues.output;
//     return response;
//   }

// }
