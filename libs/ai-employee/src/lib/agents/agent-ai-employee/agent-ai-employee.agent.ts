import { RepositoryHelper, ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IAgent, IAgentCall, IChatMessage, TaskProcess } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentCall } from "@cognum/models";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { LLMResult } from '@langchain/core/outputs';
import { DynamicTool } from "@langchain/core/tools";
import * as _ from 'lodash';
import { Subject } from "rxjs";
import { AgentTools } from "../agent-tools/agent-tools.agent";
import { AgentAIEmployeeHandlers } from "./agent-ai-employee-handlers.handler";

export class AgentAIEmployee implements IAgent {
  _executor: AgentExecutor;
  handlers = new AgentAIEmployeeHandlers();
  agentTools: AgentTools;

  calls: IAgentCall[] = [];
  $calls: Subject<IAgentCall[]> = new Subject();
  private _calls: IAgentCall[] = [];

  constructor(
    public aiEmployee: IAIEmployee,
    private chatHistory?: Partial<IChatMessage>[]
  ) { }

  async init() {
    // AI Employee Tools
    this.aiEmployee.tools.push({
      id: 'knowledge-retriever',
      options: {
        workspaceId: this.aiEmployee.workspace
      }
    });

    // Agent Tools
    this.agentTools = await new AgentTools(this.aiEmployee).init();

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
    const _updateCalls = this._updateCalls.bind(this);

    const toolsDescriptions = this.aiEmployee.tools.map(t => {
      const tool = ToolsHelper.get(t.id);
      if (!tool) return '';
      return `${tool.name}: ${tool.description || ''}`;
    }).join(', ').toLowerCase();
    const description = `This tool has the ability to perform tasks such as: ${toolsDescriptions}. The input needs to be a question or instruction with information to perform the task.`;

    return [
      new DynamicTool({
        name: 'execute-tasks',
        description,
        func: async (input: string) => {
          try {
            const call = this.calls[this.calls.length - 1];
            let task: TaskProcess;

            console.log('input', input);

            const callbacks = [{
              handleToolStart(tool: unknown, input: string, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>) {
                task = {
                  tool: null,
                  input,
                  output: null,
                  status: 'running',
                  taskTokenUsage: 0,
                  startAt: new Date(),
                  endAt: null
                };
                call.tasks.push(task);
                task.tool = metadata.id || tool['id'][2];
                _updateCalls();
              },
              handleToolEnd(output: string) {
                task.endAt = new Date();
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
            }];

            const response = await this.agentTools.call(input, callbacks);
            if (task) task.output = response;

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
    ];
  }

  formatChatHistory(): BaseChatMessageHistory {
    const chatHistory = new ChatMessageHistory();
    for (const message of this.chatHistory || []) {
      if (message.role === 'user') {
        chatHistory.addUserMessage(message.content);
      } else {
        chatHistory.addAIChatMessage(message.content);
      }
    }
    return chatHistory;
  }

  async call(input: string, intent: string, callbacks: unknown[] = []): Promise<IAgentCall> {
    const repository = new RepositoryHelper<IAgentCall>(AgentCall);
    const agentCall: IAgentCall = await repository.create({
      input,
      output: '',
      tasks: [],
      callTokenUsage: 0,
      totalTokenUsage: 0,
      status: 'running',
      startAt: new Date(),
      endAt: null,
      createdBy: this.aiEmployee._id,
      updatedBy: this.aiEmployee._id,
    }) as IAgentCall;
    this.calls.push(agentCall);
    this._updateCalls();

    const _updateCalls = this._updateCalls.bind(this);
    const process = this.processes;
    const agentCallCallbacks = {
      handleLLMEnd() {
        agentCall.status = 'done';
        agentCall.endAt = new Date();
        _updateCalls();
      },
      handleLLMNewToken() {
        const processLength = process.length;
        if (processLength) {
          agentCall.output = process[processLength - 1].llmOutputFormatted;
          _updateCalls();
        }
      }
    };

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
    if (JSON.stringify(this._calls) === JSON.stringify(this.calls)) return;
    this._calls = _.cloneDeep(this.calls);
    this.$calls.next(this.calls);
  }

}
