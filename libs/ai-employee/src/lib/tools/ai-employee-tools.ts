import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IToolSettings, IUser } from "@cognum/interfaces";
import { ChatModel, EmbeddingsModel } from "@cognum/llm";
import { GoogleCalendarToolkit, KnowledgeRetrieverTool, LinkedInFindLeadsTool, MailToolSettings, MailToolkit, PythonTool, RandomNumberTool, SQLConnectorTool, WebBrowserToolkit } from "@cognum/tools";
import { Document } from "langchain/document";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { DynamicStructuredTool, SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { INTENTIONS } from "../utils/intent-classifier/intent-classifier.util";
import { Knowledge } from "@cognum/models";

export class AIEmployeeTools {

  static async intetionTools(options: { aiEmployee: IAIEmployee; intentions?: string[]; user: Partial<IUser> }) {
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
      if (options.user) toolSettings.options.user = options.user;
      const tool = ToolsHelper.get(toolSettings.id);
    
      if (!tool) return false;
    
      for (const intetion of tool.intentions || []) {
        if (intentions.includes(intetion)) return true;
      }
      return false;
    })
    
    const toolsSettings = [...commonTools, ...filteredToolsSettings]
    const tools: any[] = AIEmployeeTools.get(toolsSettings);

    // Resource: Knowledge Retriever
    const knowledges = await Knowledge
      .find({ workspace: aiEmployee.workspace })
      .select('openaiFileId')
      .lean();
    const openaiFileIds = knowledges.map(({ openaiFileId }) => openaiFileId);
    const toolkit = [new KnowledgeRetrieverTool({ openaiFileIds })]
    tools.push(...toolkit)

    // Resource: Web browser
    if (aiEmployee.resources?.browser && intentions.includes(INTENTIONS.TASK_EXECUTION)) {
      // const toolkit = WebBrowserToolkit({ webBrowser: aiEmployee.resources.browser }) as Tool[];
      // tools.push(...toolkit)
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
      case 'random-number':
        return [new RandomNumberTool()];
      case 'mail':
        return MailToolkit(toolSettings.options);
      case 'python':
        return [new PythonTool()];
      case 'sql-connector':
        return [new SQLConnectorTool(toolSettings.options)];
      case 'linkedin-lead-scraper':
        return [new LinkedInFindLeadsTool(toolSettings.options)]
      case 'google-calendar':
        return GoogleCalendarToolkit(toolSettings.options);
    }
  }

  static async filterByContext(tools: (Tool[] | DynamicStructuredTool[]), input: string, formattedToolsContext: string) {
    const model = new ChatModel({ temperature: 0.7 });
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
    console.log({ docs: docs.map(doc => doc.pageContent) })

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new EmbeddingsModel());
    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(3),
    });

    const formattedInput = `Goal: Which tools are relevant to execute this task?\nTask: ${input}\n\nUse context below to help you to choose the best tool:\n${formattedToolsContext}`
    console.log({ formattedInput });


    let retrievedDocs = await retriever.getRelevantDocuments(formattedInput);
    console.log({ toolsFounded: retrievedDocs });

    if (!retrievedDocs.length) {
      // TODO add basic tools
      retrievedDocs = [
        { pageContent: '', metadata: { id: 'mail', tool: 'send' } },
        { pageContent: '', metadata: { id: 'knowledge-retriever' } },
      ]
    }

    // Filter tools by retrieved docs
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
