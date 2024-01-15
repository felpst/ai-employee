import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class WebBrowserExtractDataTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Extract Data',
      metadata: { id: "web-browser", tool: 'extractData' },
      description: 'Use this tool to extract data from inside an element on an web page, such as lists, tables or structured divs/sections.',
      schema: z.object({
        selectorId: z.number().describe("selector-id attribute of the element used as data source."),
      }),
      func: async ({ selectorId }) => {
        try {
          const selector = settings.webBrowserService.findElementById(selectorId);
          const extractData = await settings.webBrowserService.extractData(selector);

          const json = JSON.stringify(extractData);
          return json;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
