// import { ChatModel } from '@cognum/llm';
// import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
// import { LLMChain } from 'langchain/chains';
// import { ChatOpenAI as LangchainChatOpenAI } from 'langchain/chat_models/openai';
// import { Callbacks } from 'langchain/dist/callbacks';
// import { BufferMemory, ChatMessageHistory } from "langchain/memory";
// import { Tool } from 'langchain/tools';
// import { Profile } from '../modules';
// import { AIEmployeeOutputParser, AIEmployeePromptTemplate } from '../prompts/prompts.helper';

// export class AIEmployeeAgent {
//   private _profile: Profile = {
//     name: 'Atlas',
//     role: 'Assistant',
//   };
//   private _tools: Tool[] = [];
//   private _model: LangchainChatOpenAI;
//   private _memory: BufferMemory = this.memory();
//   private _callbacks: Callbacks;

//   private _chain: LLMChain;
//   private _agent: LLMSingleActionAgent;
//   private _executor: AgentExecutor;

//   constructor(data?: {
//     profile?: Profile;
//     tools?: Tool[];
//     model?: LangchainChatOpenAI;
//     callbacks?: Callbacks;
//   }) {
//     if (data?.profile) { this._profile = data.profile; }
//     if (data?.tools) { this._tools = data.tools; }
//     if (data?.model) { this._model = data.model; }
//     if (data?.callbacks) { this._callbacks = data.callbacks; }
//     this.init();


//     // const workspaceId = this._chat.aiEmployee.toString();
//     // // Tools
//     // this._tools = [
//     //   // new DatabaseConnect(),
//     //   // new SerpAPI(process.env.SERPAPI_API_KEY),
//     //   new Calculator(),
//     //   // new ChatHistoryTool(this.memory),
//     //   // new ZapierTool(),
//     //   // new KnowledgeBaseTool(workspaceId),
//     // ];


//   }

//   init() {
//     this._model = this.chatModel();

//     this._chain = new LLMChain({
//       llm: this._model,
//       prompt: new AIEmployeePromptTemplate({
//         tools: this._tools,
//         inputVariables: ['input', 'agent_scratchpad', 'intermediate_steps'],
//         profile: this._profile,
//         // memory: this._memory,
//       }),
//     });

//     this._agent = new LLMSingleActionAgent({
//       llmChain: this._chain,
//       outputParser: new AIEmployeeOutputParser(),
//       stop: ['\nObservation'],
//     });

//     this._executor = new AgentExecutor({
//       agent: this._agent,
//       tools: this._tools,
//     });
//     console.log('Loaded agent.');
//   }



//   async call(input: string, callbacks?: Callbacks | any) {
//     // Save input
//     // const message = await this.memory.addMessage({
//     //   content: input,
//     //   role: 'HUMAN',
//     // });
//     // if (callbacks.onSaveHumanMessage) {
//     //   callbacks.onSaveHumanMessage(message);
//     // }

//     // Executor
//     const chainValues = await this._executor.call({ input }, callbacks);
//     const response = chainValues.output;
//     // const thought = this._agent.outputParser.getLastThought();

//     // Save response
//     // this.memory
//     //   .addMessage({
//     //     content: response,
//     //     role: 'AI',
//     //     // question: message._id,
//     //     // thought,
//     //   })
//     //   .then((responseMessage) => {
//     //     if (callbacks.onSaveAIMessage) {
//     //       callbacks.onSaveAIMessage(responseMessage);
//     //     }

//     //     // Generate chat name
//     //     if (
//     //       this.memory.chat.name === 'New chat' &&
//     //       this.memory.messages.length >= 2
//     //     ) {
//     //       this.memory.chatName(callbacks);
//     //     }
//     //   });

//     return response;
//   }

//   chatModel() {
//     const configChatModel = {
//       streaming: true,
//       callbacks: this._callbacks,
//       verbose: true,
//     };

//     return new ChatModel(configChatModel);
//   }

//   memory() {
//     return new BufferMemory({
//       chatHistory: new ChatMessageHistory([]),
//     });
//     // return new AIEmployeeMemory({
//     //   chat: this._chat,
//     //   user: this._user,
//     // });
//   }

//   getProfile() {
//     return this._profile;
//   }

//   async chatHistory(numberOfMessages = 10) {
//     return []
//     // const messages = this.memory.getLastMessages(numberOfMessages);
//     // return messages.map((message) => ({
//     //   _id: message._id,
//     //   content: message.content,
//     //   role: message.role,
//     //   feedbacks: message.feedbacks,
//     //   thought: message.thought,
//     //   createdBy: message.createdBy,
//     //   createdAt: message.createdAt,
//     // }));
//   }


// }
