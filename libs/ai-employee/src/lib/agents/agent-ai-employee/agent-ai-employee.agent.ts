import { IAIEmployee, IChatMessage } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { BaseChatMessageHistory, LLMResult } from "langchain/schema";
import { DynamicTool } from "langchain/tools";
import { Subject } from "rxjs";
import { Agent, CallResponse, TaskProcess } from "../../../../../interfaces/src/agent.interface";
import { AgentTools } from "../agent-tools/agent-tools.agent";
import { AgentAIEmployeeHandlers } from "./agent-ai-employee-handlers.handler";

export class AgentAIEmployee implements Agent {
  _executor: AgentExecutor;
  handlers = new AgentAIEmployeeHandlers();
  calls: CallResponse[] = [];
  $calls: Subject<CallResponse[]> = new Subject();

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
          const call = this.calls[this.calls.length - 1];
          let task: TaskProcess;
          const _updateCalls = this._updateCalls.bind(this);

          console.log('input', input);

          const callbacks = [{
            handleToolStart(tool: any, input: string, runId: string, parentRunId?: string, tags?: string[], metadata?: Record<string, unknown>, name?: string) {
              console.log('handleToolStart', JSON.stringify({ tool, input, runId, parentRunId, tags, metadata, name }));
              task = {
                tool: null,
                input,
                output: null,
                status: 'running',
                taskTokenUsage: 0
              }
              call.tasks.push(task);
              task.tool = metadata.id || tool.id[2];
              _updateCalls();
            },
            handleToolEnd(output: string) {
              task.output = output;
              task.status = 'done';
              _updateCalls();
            },
            handleLLMEnd(output: LLMResult) {
              task.taskTokenUsage = task.taskTokenUsage + output.llmOutput?.estimatedTokenUsage?.totalTokens || 0;
              _updateCalls();
            }
          }]

          const response = await agent.call(input, callbacks);
          task.output = response;
          console.log('response', response);

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

  async call(input: string, callbacks: unknown[] = []): Promise<CallResponse> {
    const callResponse: CallResponse = {
      input,
      output: '',
      tasks: [],
      callTokenUsage: 0,
      totalTokenUsage: 0,
      status: 'running'
    }
    this.calls.push(callResponse);
    this._updateCalls();

    const _updateCalls = this._updateCalls.bind(this);
    const callResponseCallbacks = {
      handleLLMEnd() {
        callResponse.status = 'done';
        _updateCalls();
      }
    }

    const chainValues = await this._executor.call({ input }, [...callbacks, this.handlers, callResponseCallbacks]);
    callResponse.output = chainValues.output;
    callResponse.callTokenUsage = this.processes.reduce((acc, process) => acc + process.totalTokenUsage, 0);
    callResponse.totalTokenUsage = callResponse.callTokenUsage + callResponse.tasks.reduce((acc, task) => acc + task.taskTokenUsage, 0);
    this._updateCalls();

    return callResponse;
  }

  private _updateCalls() {
    this.$calls.next(this.calls);
  }

}
