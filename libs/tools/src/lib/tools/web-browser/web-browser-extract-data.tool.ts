import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { ElementSelector, WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserExtractDataTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Extract Data',
      metadata: { id: "web-browser", tool: 'extractData' },
      description: 'Use this tool to extract data from an element on an web page.',
      schema: z.object({
        elementSelector: z.string().describe("the selector of the html element."),
        selectorType: z.nativeEnum(ElementSelector).describe("type of the selector."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms.")
      }),
      func: async ({
        elementSelector,
        selectorType,
        findTimeout
      }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          return browserService.extractData({
            elementSelector,
            selectorType,
            findTimeout
          });
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
