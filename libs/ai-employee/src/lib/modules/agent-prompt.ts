import { IAIEmployee } from "@cognum/interfaces";
import { ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate } from "langchain/prompts";
import { Tool } from "langchain/tools";
import { renderTextDescriptionAndArgs } from "langchain/tools/render";
import { AIEmployeeTools } from "../tools/ai-employee-tools";
import { AgentModuleAction } from "./agent-action.module";
import { AgentModuleMemory } from "./agent-memory.module";
import { AgentModulePlanning } from "./agent-planning.module";
import { AgentModuleProfile } from "./agent-profile.module";
import { AgentPromptOutputParser } from "./agent-prompt-output-parser";

export class AgentPrompt {
  private _profile: AgentModuleProfile;
  private _memory: AgentModuleMemory;
  private _planning: AgentModulePlanning;
  private _action: AgentModuleAction;
  private _tools: Tool[];

  constructor(
    private aiEmployee: IAIEmployee
  ) {
    const workspaceId = this.aiEmployee.workspace.toString();

    this._profile = new AgentModuleProfile(this.aiEmployee);
    this._memory = new AgentModuleMemory(this.aiEmployee);
    this._planning = new AgentModulePlanning(this.aiEmployee);
    this._action = new AgentModuleAction(this.aiEmployee);
    this._tools = new AIEmployeeTools(workspaceId).get(this.aiEmployee.tools);
  }

  async format(): Promise<ChatPromptTemplate<any, any>> {
    const profile = await this._profile.prompt();
    const memory = await this._memory.prompt();
    const planning = await this._planning.prompt();
    const action = await this._action.prompt();

    const modules = [];
    if (profile) modules.push(profile);
    if (memory) modules.push(memory);
    if (planning) modules.push(planning);
    if (action) modules.push(action);

    const template = modules.join('\n\n');

    const toolNames = this._tools.map((tool) => tool.name);
    const inputVariables = ["input", "agent_scratchpad"];
    const messages = [
      new HumanMessagePromptTemplate(
        new PromptTemplate({
          template,
          inputVariables,
          partialVariables: {
            tool_schemas: renderTextDescriptionAndArgs(this._tools),
            tool_names: toolNames.join(", "),
          },
        })
      )
    ];
    const prompt = ChatPromptTemplate.fromMessages(messages);
    return prompt;
  }

  agentOutputParser() {
    return new AgentPromptOutputParser();
  }

}
