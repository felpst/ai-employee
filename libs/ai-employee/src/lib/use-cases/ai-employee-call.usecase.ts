<<<<<<< HEAD
import { Agent } from "../../../../interfaces/src/agent.interface";
=======
import { Agent } from "../agents/interfaces/agent.interface";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

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
