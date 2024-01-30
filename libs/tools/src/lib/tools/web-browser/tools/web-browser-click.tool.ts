import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

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
        try {
          const selector = settings.browser.page.getSelectorById(selectorId);
          await settings.browser.click({ selector, ignoreNotExists: false });

          return `The element "${selector}" was clicked`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
