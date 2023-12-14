import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { ElementSelector, WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserInputTextTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Click Button',
      metadata: { id: "web-browser", tool: 'clickButton' },
      description: 'Use this tool to click a button on an web browser page.',
      schema: z.object({
        buttonSelector: z.string().describe("the selector of the html field element."),
        selectorType: z.nativeEnum(ElementSelector).describe("type of the selector."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the button element in ms.")
      }),
      func: async ({
        buttonSelector,
        selectorType,
        findTimeout
      }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);

          const success = await browserService.clickButton({
            elementSelector: buttonSelector,
            selectorType,
            findTimeout
          });
          if (!success) throw new Error("It was'nt possible to click the button");

          return 'The button was successfully clicked';
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
