import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IAgentCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { INTENTIONS } from "../../utils/intent-classifier/intent-classifier.util";
import { Agent } from "../agent";

export class TaskExecutionAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = INTENTIONS.TASK_EXECUTION
  }

  async init() {
    this._executor = await this.executor();
    return this;
  }

  async call(input: string, intent: string): Promise<IAgentCall> {
    try {
      const agentCall = await this._initCall(input, intent);
      const chainValues = await this._executor.call({ input });
      const output = chainValues.output;
      console.log(output);

      // Salvar Resposta
      await this.updateMemory(input, output)

      await this._afterCall(agentCall, output);

      // Retornar a resposta
      return agentCall;
    } catch (error) {
      console.error('[AgentTools Call]', error.message)
      return error.message;
    }
  }

  async executor() {
    const model = new ChatModel();
    const executor = await initializeAgentExecutorWithOptions(this.tools([INTENTIONS.TASK_EXECUTION]), model, {
      agentType: "structured-chat-zero-shot-react-description",
      // verbose: true,
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
    return executor;
  }

  tools(intentions: string[] = []) {
    const commonTools = ToolsHelper.tools
      .filter(tool => !tool.show)
      .filter(tool => {
        for (const intent of tool.intentions || []) {
          if (intentions.includes(intent)) return true;
        }
        return false;
      })
      .map(tool => ({ id: tool.id, }))

    const filteredToolsSettings = this.aiEmployee.tools
      .filter(toolSettings => {
        const tool = ToolsHelper.get(toolSettings.id);
        if (!tool.show) return false;
        for (const intent of tool.intentions || []) {
          if (intentions.includes(intent)) return true;
        }
        return false;
      })
    const tools = AIEmployeeTools.get([...commonTools, ...filteredToolsSettings]);
    return tools
  }

  async updateMemory(input: string, output: string) {
    // Update AIEmployee Memory
    const instruction = `Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input, output })

    const memoryInstructionResult = await this.aiEmployee.memoryInstruction(instruction, this.context)
    console.log('memoryInstructionResult', JSON.stringify(memoryInstructionResult));
  }
}
