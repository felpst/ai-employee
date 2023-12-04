import { RepositoryHelper } from "@cognum/helpers";
import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { AgentCall } from "@cognum/models";
import { AgentExecutor } from "langchain/agents";
import * as _ from 'lodash';
import { Subject } from "rxjs";
import { AgentAIEmployeeHandlers } from "./agent-ai-employee/agent-ai-employee-handlers.handler";

export class Agent {
  agent = 'Agent';
  // memory: AIEmployeeMemory = new AIEmployeeMemory();
  context: string[] = [];

  _executor: AgentExecutor;
  handlers = new AgentAIEmployeeHandlers();

  calls: IAgentCall[] = [];
  $calls: Subject<IAgentCall[]> = new Subject();
  private _calls: IAgentCall[] = [];

  constructor(
    public aiEmployee: IAIEmployee
  ) { }

  async init() {
    return this;
  }

  get processes() {
    return this.handlers.processes;
  }

  protected async _initCall(input: string, intent: string): Promise<IAgentCall> {
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
      intent,
      aiEmployee: this.aiEmployee._id,
      createdBy: this.aiEmployee._id,
      updatedBy: this.aiEmployee._id,
    }) as IAgentCall
    this.calls.push(agentCall);
    this._updateCalls();
    return agentCall;
  }

  protected async _afterCall(agentCall: IAgentCall, output: string): Promise<IAgentCall> {
    agentCall.output = output;

    // Tokens
    agentCall.callTokenUsage = this.processes.reduce((acc, process) => acc + process.totalTokenUsage, 0);
    agentCall.totalTokenUsage = agentCall.callTokenUsage + agentCall.tasks.reduce((acc, task) => acc + task.taskTokenUsage, 0);
    this._updateCalls();

    // Save call
    agentCall.save();

    return agentCall;
  }

  protected _updateCalls() {
    if (JSON.stringify(this._calls) === JSON.stringify(this.calls)) return;
    this._calls = _.cloneDeep(this.calls);
    this.$calls.next(this.calls);
  }

}
