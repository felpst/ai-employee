import { IAgent } from "@cognum/interfaces";

export class AIEmployeeCall {

  constructor(
    private aiEmployeeAgent: IAgent
  ) { }

  async execute(input: string, callbacks?: any) {
    const response = await this.aiEmployeeAgent.call(input, callbacks);
    return response;
  }
}
