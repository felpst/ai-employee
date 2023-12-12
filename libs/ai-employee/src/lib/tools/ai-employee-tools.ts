import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IToolSettings } from "@cognum/interfaces";
import { GoogleCalendarCreateEventTool, GoogleCalendarDeleteEventTool, GoogleCalendarListEventsTool, GoogleCalendarUpdateEventTool, KnowledgeRetrieverTool, LinkedInFindLeadsTool, MailSenderTool, PythonTool, RandomNumberTool, SQLConnectorTool, WebBrowserToolkit } from "@cognum/tools";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { INTENTIONS } from "../utils/intent-classifier/intent-classifier.util";

export class AIEmployeeTools {

  static intetionTools(options: { aiEmployee: IAIEmployee; intentions: string[]; }) {
    const { intentions, aiEmployee } = options;

    const commonTools = ToolsHelper.tools
      .filter(tool => !tool.show)
      .filter(tool => {
        for (const intetion of tool.intentions || []) {
          if (intentions.includes(intetion)) return true;
        }
        return false;
      })
      .map(tool => ({ id: tool.id, }))

    const filteredToolsSettings = aiEmployee.tools.filter(toolSettings => {
      const tool = ToolsHelper.get(toolSettings.id);
      for (const intetion of tool.intentions || []) {
        if (intentions.includes(intetion)) return true;
      }
      return false;
    })
    const toolsSettings = [...commonTools, ...filteredToolsSettings]
    const tools = AIEmployeeTools.get(toolsSettings);

    // Resource: Web browser
    if (intentions.includes(INTENTIONS.TASK_EXECUTION)) {
      const toolkit = WebBrowserToolkit({ webBrowser: aiEmployee.resources.browser }) as Tool[];
      tools.push(...toolkit)
    }

    return tools;
  }

  static get(toolsSettings: IToolSettings[] = []): Tool[] {
    const tools: Tool[] = [];
    for (const toolSettings of toolsSettings) {
      const tool = AIEmployeeTools.initTool(toolSettings) as Tool[]
      if (tool) tools.push(...tool);
    }
    return tools
  }

  static initTool(toolSettings: IToolSettings): DynamicStructuredTool[] | Tool[] {
    switch (toolSettings.id) {
      case 'calculator':
        return [new Calculator()];
      case 'google-search':
        // eslint-disable-next-line no-case-declarations
        const tool = new SerpAPI();
        tool.metadata = {
          id: 'google-search',
        }
        return [tool];
      // case 'web-browser':
      //   return [new WebBrowserTool()];
      case 'random-number':
        return [new RandomNumberTool()];
      case 'mail-sender':
        return [new MailSenderTool(toolSettings.options)];
      case 'python':
        return [new PythonTool()];
      case 'sql-connector':
        return [new SQLConnectorTool(toolSettings.options)];
      case 'knowledge-retriever':
        return [new KnowledgeRetrieverTool(toolSettings.options)]
      case 'linkedin-lead-scraper':
        return [new LinkedInFindLeadsTool(toolSettings.options)]
      case 'google-calendar':
        const tools = []
        if (toolSettings.options.tools.list) {
          tools.push(new GoogleCalendarListEventsTool(toolSettings.options.token))
        }
        if (toolSettings.options.tools.create) {
          tools.push(new GoogleCalendarCreateEventTool(toolSettings.options.token))
        }
        if (toolSettings.options.tools.update) {
          tools.push(new GoogleCalendarUpdateEventTool(toolSettings.options.token))
        }
        if (toolSettings.options.tools.delete) {
          tools.push(new GoogleCalendarDeleteEventTool(toolSettings.options.token))
        }
        return tools;
    }
  }
}
