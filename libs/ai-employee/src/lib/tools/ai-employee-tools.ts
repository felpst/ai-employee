import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IToolSettings } from "@cognum/interfaces";
import { ChatModel, EmbeddingsModel } from "@cognum/llm";
import { GoogleCalendarCreateEventTool, GoogleCalendarDeleteEventTool, GoogleCalendarListEventsTool, GoogleCalendarUpdateEventTool, KnowledgeRetrieverTool, LinkedInFindLeadsTool, MailToolSettings, MailToolkit, PythonTool, RandomNumberTool, SQLConnectorTool, WebBrowserToolkit } from "@cognum/tools";
import { Document } from "langchain/document";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { INTENTIONS } from "../utils/intent-classifier/intent-classifier.util";

export class AIEmployeeTools {

  static intetionTools(options: { aiEmployee: IAIEmployee; intentions?: string[]; }) {
    let { intentions, aiEmployee } = options;
    if (!intentions) intentions = [];

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
    if (aiEmployee.resources?.browser && intentions.includes(INTENTIONS.TASK_EXECUTION)) {
      const toolkit = WebBrowserToolkit({ webBrowser: aiEmployee.resources.browser }) as Tool[];
      tools.push(...toolkit)
    }

    // Resource: AI Employee Email
    if (!tools.find(tool => tool.metadata.id === 'mail')) {
      const mailToolkit = MailToolkit(AIEmployeeTools.MailToolkitSettings(aiEmployee)) as Tool[];
      tools.push(...mailToolkit)
    }

    return tools;
  }

  static MailToolkitSettings(aiEmployee?: IAIEmployee): MailToolSettings {
    return {
      from: aiEmployee ? `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>` : undefined,
      replyTo: aiEmployee ? `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>` : undefined,
      auth: {
        user: process.env.AI_EMPLOYEE_EMAIL_USER,
        pass: process.env.AI_EMPLOYEE_EMAIL_PASSWORD,
      },
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        tls: true,
      },
      imap: {
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
      },
      tools: {
        send: true,
        read: true,
      }
    }
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
      case 'mail':
        return MailToolkit(toolSettings.options);
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

  static async filterByContext(tools: (Tool[] | DynamicStructuredTool[]), input: string) {
    const model = new ChatModel();
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    const docs = tools.map((tool: any) => {
      return new Document({
        pageContent: `Tool ${tool.name}: ${tool.description}`,
        metadata: {
          id: tool.metadata.id || tool.id,
          tool: tool.metadata.tool || undefined,
          schema: JSON.stringify(tool.schema || {}),
        }
      })
    })

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new EmbeddingsModel());

    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(3),
    });

    const retrievedDocs = await retriever.getRelevantDocuments(
      `Task: ${input}\n\nWhich tools are relevant to execute this task?`
    );

    console.log({ retrievedDocs });

    const filteredTools = [];
    for (const tool of tools) {
      if (retrievedDocs.find(doc => doc.metadata.id === tool.metadata.id)) {
        if (tool.metadata.tool) {
          if (retrievedDocs.find(doc => doc.metadata.tool === tool.metadata.tool)) {
            filteredTools.push(tool)
          }
        } else {
          filteredTools.push(tool)
        }
      }
    }

    return filteredTools;
  }
}
