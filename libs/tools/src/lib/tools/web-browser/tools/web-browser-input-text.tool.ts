import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

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
        let success = false;
        let message: string;
        let params: { selector: string, content: string; };

        try {
          const selector = settings.browser.page.getSelectorById(selectorId);
          params = { selector, content };
          success = await settings.browser.inputText(params);

          message = `Input was done!`;
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success,
            message,
            action: {
              method: settings.browser.inputText.name,
              params
            }
          });
        }
      },
    });
  }
}
