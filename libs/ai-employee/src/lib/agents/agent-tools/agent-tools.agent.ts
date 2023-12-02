import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { Agent } from "../agent";

export class AgentTools extends Agent {

  constructor(
    public aiEmployee: IAIEmployee,
    private intentions: string[] = [],
  ) {
    super(aiEmployee);
    this.agent = 'tools'
  }

  async init() {
    const model = new ChatModel();

    const commonTools = ToolsHelper.tools
      .filter(tool => !tool.show)
      .filter(tool => {
        for (const intetion of tool.intentions || []) {
          if (this.intentions.includes(intetion)) return true;
        }
        return false;
      })
      .map(tool => ({ id: tool.id, }))

    const filteredToolsSettings = this.aiEmployee.tools.filter(toolSettings => {
      const tool = ToolsHelper.get(toolSettings.id);
      if (tool.show) return false;
      for (const intetion of tool.intentions || []) {
        if (this.intentions.includes(intetion)) return true;
      }
      return false;
    })
    const tools = AIEmployeeTools.get([...commonTools, ...filteredToolsSettings]);

    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        suffix: "IMPORTANT: If you don't have a tool to execute the job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });

    return this;
  }

  async call(input: string, callbacks: unknown[] = []): Promise<string> {
    try {
      const chainValues = await this._executor.call({ input }, [...callbacks]);
      const response = chainValues.output;
      return response;
    } catch (error) {
      console.error('[AgentTools Call]', error.message)
      return error.message;
    }
  }

}
