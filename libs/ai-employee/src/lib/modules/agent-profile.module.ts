import { IAIEmployee } from "@cognum/interfaces";

export class AgentModuleProfile {

  constructor(
    private aiEmployee: IAIEmployee
  ) { }

  async prompt() {
    const name = await this._name();
    const role = await this._role();

    const template = [name, role].join('\n');
    return template;
  }

  private async _name() {
    return `Your name is ${this.aiEmployee.name || 'Atlas'}.`
  }
  private async _role() {
    return `You are a ${this.aiEmployee.role || 'Assistant'}`
  }


}
