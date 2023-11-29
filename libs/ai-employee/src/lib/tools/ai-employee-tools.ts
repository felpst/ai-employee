import { IToolSettings } from "@cognum/interfaces";
import { KnowledgeRetrieverTool, MailSenderTool, PythonTool, RandomNumberTool, SQLConnectorTool, WebBrowserTool } from "@cognum/tools";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export class AIEmployeeTools {

  static get(toolsSettings: IToolSettings[] = []): Tool[] {
    const tools: Tool[] = [];
    for (const toolSettings of toolsSettings) {
      const tool = AIEmployeeTools.initTool(toolSettings) as Tool
      if (tool) tools.push(tool);
    }
    return tools
  }

  static initTool(toolSettings: IToolSettings): Tool | DynamicStructuredTool {
    switch (toolSettings.id) {
      case 'calculator':
        return new Calculator();
      case 'google-search':
        // eslint-disable-next-line no-case-declarations
        const tool = new SerpAPI();
        tool.metadata = {
          id: 'google-search',
        }
        return tool;
      case 'web-browser':
        return new WebBrowserTool();
      case 'random-number':
        return new RandomNumberTool();
      case 'mail-sender':
        return new MailSenderTool(toolSettings.options);
      case 'python':
        return new PythonTool();
      case 'sql-connector':
        return new SQLConnectorTool(toolSettings.options);
      case 'knowledge-retriever':
        return new KnowledgeRetrieverTool(toolSettings.options)
    }
  }
}
