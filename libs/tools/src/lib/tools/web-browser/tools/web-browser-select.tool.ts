import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

export class WebBrowserSelectOption extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Select Option',
      metadata: { id: "web-browser", tool: 'selectOption' },
      description: 'Use this to select an option on an web browser page selector element.',
      schema: z.object({
        text: z.string().describe("displayed text of the choosen option element."),
        tagName: z.string().describe("html tag of the choosen option element.").default('option'),
      }),
      func: async (input) => {
        let success = false;
        let message: string;
        let params: {
          text: string,
          tagName: string,
          ignoreNotExists?: boolean;
          sleep?: number;
        };

        try {
          params = {
            ...input,
            ignoreNotExists: false
          };
          success = await settings.browser.clickByText(params);

          message = 'The option was selected!';
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success,
            message,
            action: {
              method: settings.browser.clickByText.name,
              params
            }
          });
        }
      },
    });
  }
}
