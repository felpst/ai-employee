
import axios from 'axios';
import { DynamicTool } from '@langchain/core/tools';
import { CSVAssistantToolSettings } from './';
import { Knowledge } from '@cognum/models';

export class CSVAssistant extends DynamicTool {
  constructor(settings: CSVAssistantToolSettings) {
    super({
      name: 'CSV Assistant',
      metadata: {
        id: "csv-assistant"
      },
      description:
        'Use to get the results of an analysis of one or many spreadsheet files saved. Input should be a question.',
      func: async (input: string) => {
        try {
          const TOOL_INSTRUCTIONS = 'You are data scientist. Before you start, you need to load and prepare data frames, understand what data is in them and what it means. In case you need a lib that is not in the environment, use the lib subprocess to install them.';

          const knowledgeUrls =
            (await Knowledge.find({ workspace: settings.workspaceId })
              .select('contentUrl')
              .lean())
              .map(({ contentUrl }) => contentUrl);

          const csvFileUrls = knowledgeUrls.filter(url => url?.endsWith('.csv'));
          const { data } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/python`, {
            input_text: input,
            instructions: TOOL_INSTRUCTIONS,
            file_urls: csvFileUrls
          }, { timeout: 300000 });
          return data.result;
        } catch (error) {
          console.log(error);
          return error.message;
        }
      },
    });
  }
}
