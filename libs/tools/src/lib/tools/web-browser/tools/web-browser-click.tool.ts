import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from '../web-browser.service';
import { WebBrowserToolSettings } from '../web-browser.toolkit';
import { IElementFindOptions } from '../common/element-schema';

export class WebBrowserClickTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Click',
      metadata: { id: "web-browser", tool: 'click' },
      description: 'Use this to click an element on an web browser page.',
      schema: z.object({
        vectorId: z.number().describe("vector-id attribute of the choosen element."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({
        vectorId,
        findTimeout
      }) => {
        try {
          const selector = settings.webBrowserService.findElementById(vectorId);

          const success = await settings.webBrowserService.clickElement({
            elementSelector: selector,
            selectorType: 'css',
            findTimeout
          });
          if (!success) throw new Error("It was'nt possible to click the element");

          return `The element "${selector}" was clicked`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
