import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

export class WebBrowserClickTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Click',
      metadata: { id: "web-browser", tool: 'click' },
      description: 'Use this to click an element on an web browser page.',
      schema: z.object({
        selectorId: z.number().describe("selector-id attribute of the choosen element."),
      }),
      func: async ({
        selectorId,
      }) => {
        let success = false;
        let message: string;
        let params: { selector: string, ignoreNotExists: boolean; };

        try {
          params = {
            selector: settings.browser.page.getSelectorById(selectorId),
            ignoreNotExists: false
          };
          success = await settings.browser.click(params);

          message = 'The element was clicked!';
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success,
            message,
            action: {
              method: settings.browser.click.name,
              params
            }
          });
        }
      },
    });
  }
}
