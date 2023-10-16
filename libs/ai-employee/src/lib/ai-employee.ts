import { IChat, ICompany, IUser } from '@cognum/interfaces';
import {
  AIEmployeeIdentity, AIEmployeeMemory, AIEmployeeOutputParser,
  AIEmployeePromptTemplate, KnowledgeBaseTool
} from '@cognum/tools';
import { AgentExecutor, LLMSingleActionAgent } from 'langchain/agents';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Callbacks } from 'langchain/dist/callbacks';
import { Tool } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

export class AIEmployee {
  private _chat: IChat;
  private _user: IUser;

  private _model: ChatOpenAI;
  private _callbacks: Callbacks;
  private _tools: Tool[];
  memory: AIEmployeeMemory;
  private _chain: LLMChain;
  private _agent: LLMSingleActionAgent;
  private _executor: AgentExecutor;

  private _identity: AIEmployeeIdentity = {
    name: 'Atlas',
    profession: 'Assistant',
  };

  constructor(data: {
    chat: IChat;
    user: IUser;
    callbacks?: Callbacks;
    identity?: AIEmployeeIdentity;
  }) {
    this._chat = data.chat;
    this._user = data.user;

    if (data.callbacks) {
      this._callbacks = data.callbacks;
    }
    if (data.identity) {
      this._identity = data.identity;
    }

    this._model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
      streaming: true,
      callbacks: this._callbacks,
      // verbose: true,
    });

    this.memory = new AIEmployeeMemory({
      chat: this._chat,
      user: this._user,
    });

    // Tools
    this._tools = [
      // new DatabaseConnect(),
      // new SerpAPI(process.env.SERPAPI_API_KEY),
      new Calculator(),
      // new ChatHistoryTool(this.memory),
      // new ZapierTool(),
      new KnowledgeBaseTool(),
    ];

    this._chain = new LLMChain({
      llm: this._model,
      prompt: new AIEmployeePromptTemplate({
        tools: this._tools,
        inputVariables: ['input', 'agent_scratchpad', 'intermediate_steps'],
        identity: this._identity,
        memory: this.memory,
        user: this._user,
        company: this._chat.company as ICompany,
      }),
    });

    this._agent = new LLMSingleActionAgent({
      llmChain: this._chain,
      outputParser: new AIEmployeeOutputParser(),
      stop: ['\nObservation'],
    });

    this._executor = new AgentExecutor({
      agent: this._agent,
      tools: this._tools,
    });
    console.log('Loaded agent.');
  }

  async call(input: string, callbacks?: Callbacks | any) {
    // Save input
    const message = await this.memory.addMessage({
      content: input,
      role: 'HUMAN',
    });
    if (callbacks.onSaveHumanMessage) {
      callbacks.onSaveHumanMessage(message);
    }

    // Executor
    const chainValues = await this._executor.call({ input }, callbacks);
    const response = chainValues.output;

    // Save response
    this.memory
      .addMessage({ content: response, role: 'AI', question: message._id })
      .then((responseMessage) => {
        if (callbacks.onSaveAIMessage) {
          callbacks.onSaveAIMessage(responseMessage);
        }

        // Generate chat name
        if (
          this.memory.chat.name === 'New chat' &&
          this.memory.messages.length >= 2
        ) {
          this.memory.chatName(callbacks);
        }
      });

    return response;
  }

  getIdentity() {
    return this._identity;
  }

  async chatHistory(numberOfMessages = 10) {
    const messages = this.memory.getLastMessages(numberOfMessages);
    return messages.map((message) => ({
      _id: message._id,
      content: message.content,
      role: message.role,
      feedbacks: message.feedbacks,
      createdBy: message.createdBy,
      createdAt: message.createdAt,
    }));
  }
}
