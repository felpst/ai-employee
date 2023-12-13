import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { ElementSelector, IElementFindOptions, WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserInputTextTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Input Text',
      metadata: { id: "web-browser", tool: 'inputText' },
      description: 'Use this tool to input a text to an element on web browser.',
      schema: z.object({
        textValue: z.string().describe("the text that will be input."),
        fieldSelector: z.string().describe("the selector of the html field element."),
        selectorType: z.nativeEnum(ElementSelector).describe("type of the selector."),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the input element in ms.")
      }),
      func: async ({ textValue, ...params }: IElementFindOptions & { textValue: string; }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);

          const success = await browserService.inputText(textValue, params);
          if (!success) throw new Error(`Input unsuccessful`);

          return `Input ${textValue} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
