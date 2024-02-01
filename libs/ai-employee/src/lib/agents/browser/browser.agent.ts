import { IAIEmployee, IAIEmployeeCall } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { WebBrowserToolkit } from "@cognum/tools";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";
import { BehaviorSubject } from "rxjs";
import { SystemMessage } from "langchain/schema";
import * as treeify from 'treeify';
import { WebBrowser } from '@cognum/browser';

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
  private _webBrowser: WebBrowser;

  async init(): Promise<void> {
    const llm = new ChatModel();

    // Tools
    this._webBrowser = new WebBrowser();
    await this._webBrowser.open({ headless: false });
    const tools = WebBrowserToolkit({ browser: this._webBrowser });

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
    const browser = this._webBrowser;

    let currentUrl = 'blank';
    let previousUrl = 'blank';

    const result = await this._executor.invoke({
      input,
      browserContext: []
    }, {
      callbacks: [
        {
          async handleChainStart(chain, inputs) {
            const pageElements = await browser.page.getVisibleHtml();
            const pageSize = await browser.page.getSize();

            const browserContext = {
              windowSize: {
                description: 'The window size (ViewPort) of the browser.',
                value: {
                  height: '768px',
                  width: '1366px'
                }
              },
              currentUrl: {
                description: 'The current url in the browser tab.',
                value: currentUrl
              },
              previousUrl: {
                description: 'The last url accessed in the browser tab.',
                value: previousUrl,
              },
              visibleHtml: {
                description: 'The visible html in the $windowSize.',
                value: pageElements
              },
              pageSize: {
                description: 'The total page size.',
                value: {
                  height: `${pageSize.height}px`,
                  width: `${pageSize.width}px`
                }
              }
            };

            inputs.browserContext = [new SystemMessage(`Browser Context:\n${treeify.asTree(browserContext, true, undefined)}`)];
          },
          async handleChainEnd() {
            const url = await browser.getCurrentUrl();
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
You can only see and interact with elements in the screen. Always figure out what ou need to do to find something you need.

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
