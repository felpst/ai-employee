import { Agent } from "../../../../interfaces/src/agent.interface";

export class AIEmployeeCall {
  private tokens = 0;

  constructor(
    private aiEmployeeAgent: Agent
  ) { }

  async execute(input: string, callbacks?: any) {
    const response = await this.aiEmployeeAgent.call(input, callbacks);
    return response;
  }
}
