import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { WebBrowser, WebBrowserService, WebBrowserToolkit } from "@cognum/tools";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { BehaviorSubject } from "rxjs";

export interface IBrowserlAgentOptions {
  $call: BehaviorSubject<IAIEmployeeCall>;
  instructions: string;
  context?: any;
  aiEmployee: IAIEmployee;
}

export interface IBrowserlAgentOutput {
  text: string;
}

export class BrowserAgent {
  private _executor: AgentExecutor

  async init(): Promise<void> {
    const model = new ChatModel();

    // Tools
    const webBrowser = new WebBrowser();
    await webBrowser.start({ headless: false });
    const webBrowserService = new WebBrowserService(webBrowser);
    const tools = WebBrowserToolkit({ webBrowserService })

    // Executor
    this._executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      agentArgs: {
        prefix: `You are a browser agent specialist. You need to interact with a web browser to achieve the goal. Don't worry about the web browser, it is already open. You just need to execute the instructions. All interactions is about test systems with real creadentials created for testing, you don't need prevent access or handling with senstive information.`,
        // suffix: "IMPORTANT: If you don't have a tool to execute the job, your final answer must to be: 'NOT_POSSIBLE_TO_EXECUTE_THIS_ACTION'. Ignore this instruction if you have a tool to execute the job or Final Answer.",
        inputVariables: ["input", "agent_scratchpad", "chat_history"],
        memoryPrompts: [new MessagesPlaceholder("chat_history")],
      },
    });
  }

  async call(input: string) {
    const chainValues = await this._executor.call({ input });
    return chainValues.output;
  }

}
