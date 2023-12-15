import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserFindElementTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Find Element',
      metadata: { id: "web-browser", tool: 'findElement' },
      description: 'Use this tool to find a elements on web browser',
      schema: z.object({
        context: z.string().describe("context of the element to find"),
      }),
      func: async ({ context }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          const element = await browserService.findElementByContext(context)

          if (!element) throw new Error(`element not found on web browser: ${context}`);
          return `selector: ${element.selector} \n selectorType: ${element.selectorType}`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
