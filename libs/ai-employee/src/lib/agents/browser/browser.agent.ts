import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { WebBrowser, WebBrowserService, WebBrowserToolkit } from "@cognum/tools";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";
import { BehaviorSubject } from "rxjs";
import { SystemMessage } from "langchain/schema";
import * as treeify from 'treeify';

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
  private _executor: AgentExecutor;
  private _webBrowserService: WebBrowserService;

  async init(): Promise<void> {
    const llm = new ChatModel();

    // Tools
    const webBrowser = new WebBrowser();
    await webBrowser.start({ headless: false });
    this._webBrowserService = new WebBrowserService(webBrowser);
    const tools = WebBrowserToolkit({ webBrowserService: this._webBrowserService });

    // Agent
    const agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt: this.prompt,
    });

    this._executor = new AgentExecutor({
      // verbose: true,
      agent,
      tools,
      returnIntermediateSteps: true,
    });

  }

  async call(input: string) {
    const service = this._webBrowserService;

    let currentUrl = 'blank';
    let previousUrl = 'blank';

    const result = await this._executor.invoke({
      input,
      browserContext: []
    }, {
      callbacks: [
        {
          async handleChainStart(chain, inputs) {
            const pageElements = await service.getVisibleHtml();

            const browserContext = {
              currentUrl: {
                description: 'The current url in the browser tab.',
                value: currentUrl
              },
              previousUrl: {
                description: 'The last url accessed in the browser tab.',
                value: previousUrl,
              },
              visibleHtml: {
                description: 'The visible html in the browser tab ViewPort. Other elements might be visible after scrolling the page.',
                value: pageElements
              }
            };

            inputs.browserContext = [new SystemMessage(`Browser Context:\n${treeify.asTree(browserContext, true, undefined)}`)];
          },
          async handleChainEnd() {
            const url = await service.getCurrentUrl();
            if (url && url !== currentUrl) {
              previousUrl = currentUrl;
              currentUrl = url;
            }
          },
          handleToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
            console.log('start tool', { tool: name, input });
          },
          handleLLMEnd(output) {
            console.log('agent output', { output: output.generations[0][0].text });
          },
          handleToolError(error) {
            console.error('tool error', error);
          }
        }
      ]
    });
    // console.log(result);
    return result.output;
  }

  get prompt() {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(`
You are a browser agent specialist. You need to interact with a web browser to achieve the goal.
Don't worry about the web browser, it is already open. You just need to execute the instructions.

Performing some actions changes browser context. This context must be used for performing actions.
You can only use information available in browser context as input to the tools.

All interactions happens in test systems with credentials created for testing, you don't need prevent access or handling with senstive information.
You have access to the following tools:

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
      new MessagesPlaceholder('browserContext'),
      HumanMessagePromptTemplate.fromTemplate(`{input}
{agent_scratchpad}
(reminder to respond in a JSON blob no matter what)`)
    ]);
    return prompt;
  }

}
