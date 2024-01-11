import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';
import { IElementFindOptions } from '../common/element-schema';

export class WebBrowserInputTextTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Input Text',
      metadata: { id: "web-browser", tool: 'inputText' },
      description: 'Use this to input a text to an element on web browser.',
      schema: z.object({
        textValue: z.string().describe("the text that will be input."),
        selectorId: z.number().describe("selector-id attribute of the choosen element."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({
        textValue,
        selectorId,
        findTimeout
      }) => {
        try {
          const selector = settings.webBrowserService.findElementById(selectorId);

          const success = await settings.webBrowserService.inputText(textValue, {
            elementSelector: selector,
            selectorType: 'css',
            findTimeout
          });

          if (!success) throw new Error(`Input unsuccessful`);

          return `Input ${textValue} was successfully done in element "${selector}"`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
