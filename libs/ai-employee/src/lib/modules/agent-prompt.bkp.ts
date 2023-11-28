// import { IAIEmployee } from "@cognum/interfaces";
// import { TypedPromptInputValues } from "langchain/dist/prompts/base";
// import { ChatPromptValue } from "langchain/dist/prompts/chat";
// import { BaseChatPromptTemplate, BasePromptTemplate, renderTemplate } from "langchain/prompts";
// import { AgentStep, BaseMessage, HumanMessage, PartialValues } from "langchain/schema";
// import { AgentModuleAction } from "./agent-action.module";
// import { AgentModuleMemory } from "./agent-memory.module";
// import { AgentModulePlanning } from "./agent-planning.module";
// import { AgentModuleProfile } from "./agent-profile.module";
// import { AgentPromptOutputParser } from "./agent-prompt-output-parser";

// export class AgentPrompt extends BaseChatPromptTemplate {
//   private _profile: AgentModuleProfile;
//   private _memory: AgentModuleMemory;
//   private _planning: AgentModulePlanning;
//   private _action: AgentModuleAction;

//   constructor(
//     private aiEmployee: IAIEmployee
//   ) {
//     super({ inputVariables: ['input', 'agent_scratchpad', 'intermediate_steps'] });
//     this._profile = new AgentModuleProfile(this.aiEmployee);
//     this._memory = new AgentModuleMemory(this.aiEmployee);
//     this._planning = new AgentModulePlanning(this.aiEmployee);
//     this._action = new AgentModuleAction(this.aiEmployee);
//   }

//   async formatMessages(values: TypedPromptInputValues<any>): Promise<BaseMessage[]> {
//     const profile = await this._profile.prompt();
//     const memory = await this._memory.prompt();
//     const planning = await this._planning.prompt();
//     const action = await this._action.prompt();

//     const modules = [];
//     if (profile) modules.push(profile);
//     if (memory) modules.push(memory);
//     if (planning) modules.push(planning);
//     if (action) modules.push(action);

//     const template = modules.join('\n\n');

//     /** Construct the agent_scratchpad */
//     const intermediateSteps = values.intermediate_steps as AgentStep[];
//     const agentScratchpad = intermediateSteps.reduce(
//       (thoughts, { action, observation }) =>
//         thoughts +
//         [action.log, `\nObservation: ${observation}`, 'Thought:'].join('\n'),
//       ''
//     );
//     const newInput = { agent_scratchpad: agentScratchpad, ...values };
//     const formatted = renderTemplate(template, 'f-string', newInput);

//     return [new HumanMessage(formatted)];
//   }

//   agentOutputParser() {
//     return new AgentPromptOutputParser();
//   }

//   partial(values: PartialValues): Promise<BasePromptTemplate<any, ChatPromptValue, any>> {
//     throw new Error("Method not implemented.");
//   }

//   _getPromptType(): string { return 'chat'; }

// }
