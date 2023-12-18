import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserInputTextTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Input Text',
      metadata: { id: "web-browser", tool: 'inputText' },
      description: 'Use this tool to input a text to an element on web browser.',
      schema: z.object({
        textValue: z.string().describe("the text that will be input."),
        context: z.string().describe("context of the element to input data."),
      }),
      func: async ({ textValue, context }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          const element = await browserService.findElementByContext(context)


          const success = await browserService.inputText(textValue, {
            elementSelector: element.selector,
            selectorType: element.selectorType,
          });
          if (!success) throw new Error(`Input unsuccessful`);

          return `Input ${textValue} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
