import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class WebBrowserInputTextTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Input Text',
      metadata: { id: "web-browser", tool: 'inputText' },
      description: 'Use this to input a text to an element on web browser.',
      schema: z.object({
        content: z.string().describe("the content that will be input."),
        selectorId: z.number().describe("selector-id attribute of the choosen element."),
      }),
      func: async ({
        content,
        selectorId,
      }) => {
        try {
          const selector = settings.browser.page.getSelectorById(selectorId);
          await settings.browser.inputText({ selector, content });

          return `Input ${content} was successfully done in element "${selector}"`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
