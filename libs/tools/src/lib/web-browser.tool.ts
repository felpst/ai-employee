import { BaseLanguageModel } from 'langchain/dist/base_language';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { DynamicTool } from 'langchain/tools';
import { WebBrowser } from 'langchain/tools/webbrowser';


export class WebBrowserTool extends DynamicTool {
    constructor(model: BaseLanguageModel) {
        const toolModel = model

        super({
            name: 'Web Browser',
            description:
                'useful for when you need to find something on or summarize a webpage. input should be a comma separated list of "valid URL including protocol","what you want to find on the page or empty string for a summary".',
            func: async (input: string) => {
                const embeddings = new OpenAIEmbeddings({
                    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
                    azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
                    azureOpenAIApiVersion: '2023-05-15',
                    azureOpenAIApiDeploymentName: 'gpt-35',
                })

                const result = new WebBrowser({ model: toolModel, embeddings });
                const output = await result.call({ input });
                return output;
            },
        });
    }
}
