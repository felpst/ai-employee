import { IAIEmployee, IAgentCall, IUser } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { JobService } from "@cognum/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "langchain/prompts";
import { Tool } from "langchain/tools";
import treeify from 'treeify';
import { AIEmployeeTools } from "../../tools/ai-employee-tools";
import { Agent } from "../agent";

export class GeneralAgent extends Agent {

  constructor(public aiEmployee: IAIEmployee) {
    super(aiEmployee);
    this.agent = 'general'
  }

  async call(input: string, intentions: string[] = []): Promise<IAgentCall> {
    const agentCall = await this._initCall(input, intentions.join(','));
    const model = new ChatModel();

    // Tools context
    const formattedToolsContext = treeify.asTree({
      dateNow: new Date().toISOString(),
      chatChannel: this.context.chatChannel || undefined,
    }, true)

    // Tools
    const tools = await AIEmployeeTools.intetionTools({
      aiEmployee: this.aiEmployee,
      intentions,
      user: this.context.user
    })
    // Jobs Toolkit
    if (this.context.user) {
      console.log('Create job tool added')
      const jobService = new JobService({ aiEmployee: this.aiEmployee, user: this.context.user });
      tools.push(...jobService.toolkit() as Tool[]);
    }
    const filteredTools = await AIEmployeeTools.filterByContext(tools, input, formattedToolsContext)

    let prefix = `Your name is ${this.aiEmployee.name} and your role is ${this.aiEmployee.role}. `
    prefix += `You are talking with ${this.context.user.name} <${this.context.user.email}>.`
    prefix += `You need to answer best as you can trying different tools to execute the job and achieve the goal.`

    // Adding information from the Agent's memory to the chat context so it can answer questions based on prior knowledge
    const memoryContext = await this.aiEmployee.memorySearch(input);
    if (memoryContext.accuracy) prefix += `\nMemory:${memoryContext.answer}\n`;

    // Call Context
    const formattedContext = this.formatContext();
    if (formattedContext) prefix += `\n\n${formattedContext}`

    this._executor = await initializeAgentExecutorWithOptions(filteredTools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      // verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        prefix,
        // suffix: "IMPORTANT: If you don't have a tool to execute the job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'. Ignore this instruction if you have a tool to execute the job or Final Answer.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });
    const chainValues = await this._executor.call({ input }, [this.handlers]);

    // Update AIEmployee Memory
    const memoryUpdateResponse = await this.aiEmployee.memoryInstruction(`Check if there is any relevant information in this information to add to the database:` + JSON.stringify({ input: agentCall.input, output: agentCall.output }))
    console.log({ memoryUpdateResponse });

    await this._afterCall(agentCall, chainValues.output);
    return agentCall;
  }

  formatContext() {
    // Context
    if (this.context) {
      // Date time
      this.context.dateNow = new Date().toISOString()

      if (this.context.user) {
        const user: Partial<IUser> = this.context.user
        this.context.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      }

      const treeObj = treeify.asTree(this.context, true)
      const formattedContext = `\nBelow you have access to the context of your interaction with the user, take the context into account when making your decisions.
      Context:
      \`\`\`objectTree
      ${treeObj}
      \`\`\`\n\n`
      return formattedContext;
    }
    return ''
  }
}
