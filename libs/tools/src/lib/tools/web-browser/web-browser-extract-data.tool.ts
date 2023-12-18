import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserExtractDataTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Extract Data',
      metadata: { id: "web-browser", tool: 'extractData' },
      description: 'Use this tool to extract data from an element on an web page.',
      schema: z.object({
        context: z.string().describe("context of the element to extract data."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({
        context,
        findTimeout
      }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          const element = await browserService.findElementByContext(context)
          const extractData = await browserService.extractData({
            elementSelector: element.selector,
            selectorType: element.selectorType,
            findTimeout
          });
          const json = JSON.stringify(extractData);
          console.log(json);
          return json;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
