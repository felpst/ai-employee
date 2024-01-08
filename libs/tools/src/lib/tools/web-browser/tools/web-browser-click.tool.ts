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
          let element: IElementFindOptions = {
            selectorType: 'css',
            elementSelector: await settings.webBrowserService.findElementByContent(elementTag, elementText),
            findTimeout
          };

          const success = await settings.webBrowserService.clickElement(element);
          if (!success) throw new Error("It was'nt possible to click the element");

          return `The element "${element.elementSelector}" was clicked`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
