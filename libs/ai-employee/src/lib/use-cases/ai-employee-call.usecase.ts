import { Agent } from "../agents/interfaces/agent.interface";

export class AIEmployeeCall {
  private tokens = 0;

  constructor(
    private aiEmployeeAgent: Agent
  ) { }

  async execute(input: string, callbacks?: any) {
    if (!callbacks) callbacks = [];

    callbacks.push({
      handleLLMNewToken: (token: string) => {
        // console.log("token", { token });
      }
    })

    const response = await this.aiEmployeeAgent.call(input, callbacks);
    return response;
  }
}
