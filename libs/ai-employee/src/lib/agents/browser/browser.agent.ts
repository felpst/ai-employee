import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { WebBrowser, WebBrowserService, WebBrowserToolkit } from "@cognum/tools";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { BehaviorSubject } from "rxjs";
import { HumanMessage, SystemMessage } from "langchain/schema";

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
    const llm = new ChatModel();

    // Tools
    const webBrowser = new WebBrowser();
    await webBrowser.start({ headless: false });
    const webBrowserService = new WebBrowserService(webBrowser);
    const tools = WebBrowserToolkit({ webBrowserService })

    // Agent
    const agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt: this.prompt,
    });

    this._executor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps: true
    });

  }

  async call(input: string) {
    const result = await this._executor.call({
      input,
    });
    console.log(result);
    return result.output;
  }

  get prompt() {
    return ChatPromptTemplate.fromMessages([
      new SystemMessage(`Respond to the human as helpfully and accurately as possible. You have access to the following tools:

{tools}

Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

Valid "action" values: "Final Answer" or {tool_names}

Provide only ONE action per $JSON_BLOB, as shown:

\`\`\`
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
\`\`\`

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
\`\`\`
{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation
      `),
      new MessagesPlaceholder('chat_history'),
      new HumanMessage(`{input}
{agent_scratchpad}
(reminder to respond in a JSON blob no matter what)`)
    ])
  }

}
