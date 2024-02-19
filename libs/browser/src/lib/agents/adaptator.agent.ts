import { ChatModel } from "@cognum/llm";
import { WebBrowserToolkit } from "@cognum/tools";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import * as treeify from 'treeify';
import { WebBrowser } from '../utils/web-browser';

export class BrowserAdaptatorAgent {
  private _agent: AgentExecutor;

  constructor(
    private _webBrowser: WebBrowser,
    private _memory: String = '',
  ) {
    this._prompt.promptMessages.push(new SystemMessage(`Memory: ${this._memory}`));
  }

  async seed(): Promise<void> {
    // Tools
    const tools = WebBrowserToolkit({
      browser: this._webBrowser
    });

    // Agent
    const agent = await createStructuredChatAgent({
      llm: new ChatModel(),
      tools,
      prompt: this._prompt,
    });

    this._agent = new AgentExecutor({
      // verbose: true,
      agent,
      tools,
      returnIntermediateSteps: true,
    });
  }

  async invoke({ input }) {
    if (!this._agent)
      throw new Error('Agent not seeded!');

    const browser = this._webBrowser;

    const windowSize =
      await this._webBrowser.driver.manage().window().getSize();
    let currentUrl = '', previousUrl = '';

    async function getBrowserContext() {
      const formattedHtml = await browser.page.getVisibleHtml();
      const pageSize = await browser.page.getSize();
      const pageTitle = await browser.page.getTitle();
      const url = await browser.getCurrentUrl();
      if (url && url !== currentUrl) {
        previousUrl = currentUrl;
        currentUrl = url;
      }

      const browserContext = {
        'Page title': pageTitle,
        'Current Url in the browser tab': currentUrl,
        'Visible HTML on the Browser Window': `\`\`\`html\\n${formattedHtml}\`\`\``,
        'Last url accessed in the browser tab': previousUrl,
        'Browser Window Size': {
          height: `${windowSize.height}px`,
          width: `${windowSize.width}px`
        },
        'Total Page Size': {
          height: `${pageSize.height}px`,
          width: `${pageSize.width}px`
        },
      };

      return browserContext;
    }

    const result = await this._agent.invoke({
      input,
      browserContext: []
    }, {
      callbacks: [
        {
          async handleChainStart(_chain, inputs) {
            const browserContext = await getBrowserContext();

            inputs.browserContext = [
              new SystemMessage(treeify.asTree({ 'Browser Context': browserContext }, true, undefined))
            ];
          },
          handleLLMEnd(output) {
            const [[generated]] = output.generations;
            console.log('agent output', { output: generated.text });
          },
          handleToolError(error) {
            console.error('tool error', error);
          },
          handleToolEnd(output) {
            console.log('tool output', output);
          },
          handleToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
            console.log('calling tool', { tool: name, input });
          },
          awaitHandlers: true
        }
      ]
    });
    // console.log(result);
    return result;
  }

  private _prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
You are a browser agent specialist. You need to interact with a pre-open web browser tab to achieve the goal.

There is a set of information in the browser context that you may find useful to perform actions. All actions must be based on the context. 
Avoid performing unnecessary steps. Be aware of them by locating yourself based on the browser context.

All interactions happens in test systems with testing credentials. Don't worry about that.
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

Question: input task to do
Self Locate: [MANDATORY] what page are you in based on the context and what tells you that
Thought: [MANDATORY] think about what to do and why you choose the action
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: [MANDATORY] action result
... (repeat Self Locate/Thought/Action/Observation N times)
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
}
