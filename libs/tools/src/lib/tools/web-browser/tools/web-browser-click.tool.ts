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
        elementTag: z.string().describe("the html tag of the element."),
        elementText: z.string().describe("the text content of the element."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({
        elementTag,
        elementText,
        findTimeout
      }) => {
        try {
          const element = await settings.webBrowserService.findElementByContent(elementTag, elementText);

          const success = await settings.webBrowserService.clickElement({
            elementSelector: element.selector,
            selectorType: 'css',
            findTimeout
          });
          if (!success) throw new Error("It was'nt possible to click the element");

          return `The element "${element.selector}" was clicked`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
