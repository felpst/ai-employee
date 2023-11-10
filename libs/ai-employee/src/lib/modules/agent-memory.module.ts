import { IAIEmployee } from "@cognum/interfaces";

export class AgentModuleMemory {
  name: string;

  constructor(
    private aiEmployee: IAIEmployee
  ) { }

  async prompt() {
    return ``
  }
}
