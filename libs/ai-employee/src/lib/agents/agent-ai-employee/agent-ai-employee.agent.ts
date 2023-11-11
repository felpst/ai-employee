import { IAIEmployee, IChatMessage } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { BaseChatMessageHistory } from "langchain/schema";
import { DynamicTool } from "langchain/tools";
import { AgentTools } from "../agent-tools/agent-tools.agent";
import { Agent } from "../interfaces/agent.interface";
import { AgentAIEmployeeHandlers } from "./agent-ai-employee-handlers.handler";

export class AgentAIEmployee implements Agent {
  _executor: AgentExecutor;
  handlers = new AgentAIEmployeeHandlers();

  constructor(
    private aiEmployee: IAIEmployee,
    private chatHistory?: Partial<IChatMessage>[]
  ) { }

  async init() {
    process.env.LANGCHAIN_HANDLER = "langchain";
    const model = new ChatModel();
    const tools = this.getTools();

    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "chat-conversational-react-description",
      // verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        chatHistory: this.formatChatHistory()
      }),
      agentArgs: {
        systemMessage: `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}.`,
      }
    });

    return this;
  }

  get processes() {
    return this.handlers.processes;
  }

  getTools() {
    return [
      new DynamicTool({
        name: 'agent-tools',
        description: 'This tool is useful to execute complex tasks. The input should be a question or informations to execute the job.',
        // description: 'Use this tool when you dont have informations do answer user or you need to execute a complex task. The input should be a question or informations to execute the job.',
        func: async (input: string) => {
          const agent = await new AgentTools(this.aiEmployee).init();
          const response = await agent.call(input);

          if (response === 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION') {
            // TODO log to database to create a tool
            return 'Sorry, I dont know.';
          }

          return response;
        }
      })
    ]
  }

  formatChatHistory(): BaseChatMessageHistory {
    const chatHistory = new ChatMessageHistory();
    for (const message of this.chatHistory || []) {
      if (message.role === 'user') {
        chatHistory.addUserMessage(message.content)
      } else {
        chatHistory.addAIChatMessage(message.content)
      }
    }
    return chatHistory
  }

  async call(input: string, callbacks: unknown[] = []) {
    const chainValues = await this._executor.call({ input }, [...callbacks, this.handlers]);
    const response = chainValues.output;
    return response;
  }

}
