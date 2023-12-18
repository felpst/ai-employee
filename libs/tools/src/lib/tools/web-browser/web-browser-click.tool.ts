import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserClickTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Click',
      metadata: { id: "web-browser", tool: 'click' },
      description: 'Use this tool to click an element on an web browser page.',
      schema: z.object({
        context: z.string().describe("context of the element to click."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({
        context,
        findTimeout
      }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          const element = await browserService.findElementByContext(context)


          const success = await browserService.clickElement({
            elementSelector: element.selector,
            selectorType: element.selectorType,
            findTimeout
          });
          if (!success) throw new Error("It was'nt possible to click the element");

          return 'The element was successfully clicked';
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
