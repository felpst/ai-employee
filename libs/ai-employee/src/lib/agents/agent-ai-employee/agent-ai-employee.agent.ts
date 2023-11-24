import { RepositoryHelper } from "@cognum/helpers";
import { Agent, IAIEmployee, IAgentCall, IChatMessage, TaskProcess } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentCall } from "@cognum/models";
import { ToolsHelper } from "@cognum/tools";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { BaseChatMessageHistory, LLMResult } from "langchain/schema";
import { DynamicTool } from "langchain/tools";
import { Subject } from "rxjs";
import { AgentTools } from "../agent-tools/agent-tools.agent";
import { AgentAIEmployeeHandlers } from "./agent-ai-employee-handlers.handler";

export class AgentAIEmployee implements Agent {
  _executor: AgentExecutor;
  handlers = new AgentAIEmployeeHandlers();
  calls: IAgentCall[] = [];
  $calls: Subject<IAgentCall[]> = new Subject();
  agentTools: AgentTools;

  constructor(
    private aiEmployee: IAIEmployee,
    private chatHistory?: Partial<IChatMessage>[]
  ) { }

  async init() {
    // TODO tools ai employee
    this.aiEmployee.tools = [
      {
        name: 'calculator'
      },
      {
        name: 'random-number'
      },
      {
        name: 'web-search'
      },
      {
        name: 'mail-sender',
        options: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        }
      }
    ]

    // Agent Tools
    this.agentTools = await new AgentTools(this.aiEmployee.tools).init();

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
        systemMessage: `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}.`
      }
    });

    return this;
  }

  get processes() {
    return this.handlers.processes;
  }

  getTools() {
    // TODO list tools
    const toolsDescriptions = this.aiEmployee.tools.map(tool => `${tool.name}: ${ToolsHelper.get(tool.name)?.description || ''}`).join(', ').toLowerCase();
    const description = `This tool has the ability to perform tasks such as: ${toolsDescriptions}. The input needs to be a question or instruction with information to perform the task.`

    return [
      new DynamicTool({
        name: 'execute-tasks',
        description,
        // description: 'This tool is useful to execute complex tasks. The input should be a question or informations to execute the job.',
        // description: 'Use this tool when you dont have informations do answer user or you need to execute a complex task. The input should be a question or informations to execute the job.',
        func: async (input: string) => {
          try {
            const call = this.calls[this.calls.length - 1];
            let task: TaskProcess;
            const _updateCalls = this._updateCalls.bind(this);

            console.log('input', input);

            const callbacks = [{
              handleToolStart(tool: unknown, input: string, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>) {
                task = {
                  tool: null,
                  input,
                  output: null,
                  status: 'running',
                  taskTokenUsage: 0
                }
                call.tasks.push(task);
                task.tool = metadata.id || tool['id'][2];
                _updateCalls();
              },
              handleToolEnd(output: string) {
                task.output = output;
                task.status = 'done';
                _updateCalls();
              },
              handleLLMEnd(output: LLMResult) {
                if (task) {
                  task.taskTokenUsage = task.taskTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
                }
                _updateCalls();
              }
            }]

            const response = await this.agentTools.call(input, callbacks);
            task.output = response;

            if (response === 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION') {
              // TODO log to database to create a tool
              return 'Sorry, I dont know.';
            }

            return response;

          } catch (error) {
            console.error(error);
            return error.message;
          }
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

  async call(input: string, callbacks: unknown[] = []): Promise<IAgentCall> {
    const repository = new RepositoryHelper<IAgentCall>(AgentCall);
    const agentCall: IAgentCall = await repository.create({
      input,
      output: '',
      tasks: [],
      callTokenUsage: 0,
      totalTokenUsage: 0,
      status: 'running',
      createdBy: this.aiEmployee._id,
      updatedBy: this.aiEmployee._id,
    }) as IAgentCall
    this.calls.push(agentCall);
    this._updateCalls();

    const _updateCalls = this._updateCalls.bind(this);
    const process = this.processes
    const agentCallCallbacks = {
      handleLLMEnd() {
        agentCall.status = 'done';
        _updateCalls();
      },
      handleLLMNewToken() {
        const processLength = process.length;
        if (processLength) {
          agentCall.output = process[processLength - 1].llmOutputFormatted;
          _updateCalls();
        }
      }
    }

    const chainValues = await this._executor.call({ input }, [...callbacks, this.handlers, agentCallCallbacks]);
    agentCall.output = chainValues.output;
    agentCall.callTokenUsage = this.processes.reduce((acc, process) => acc + process.totalTokenUsage, 0);
    agentCall.totalTokenUsage = agentCall.callTokenUsage + agentCall.tasks.reduce((acc, task) => acc + task.taskTokenUsage, 0);
    this._updateCalls();

    // Save call
    agentCall.save();

    return agentCall;
  }

  private _updateCalls() {
    this.$calls.next(this.calls);
  }

}
