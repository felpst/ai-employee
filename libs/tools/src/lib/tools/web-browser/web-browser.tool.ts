import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { DynamicTool } from 'langchain/tools';
import { WebBrowser } from 'langchain/tools/webbrowser';


export class WebBrowserTool extends DynamicTool {
  constructor() {
    super({
      name: 'Web Browser',
      metadata: {
        id: "web-browser"
      },
      description:
        'useful for when you need to find something on or summarize a webpage. input should be a comma separated list of "valid URL including protocol","what you want to find on the page or empty string for a summary".',
      func: async (input: string) => {
        const embeddings = new EmbeddingsModel()
        const model = new ChatModel();
        const result = new WebBrowser({ model, embeddings });
        const output = await result.call({ input });
        return output;
      },
    });
  }
}
