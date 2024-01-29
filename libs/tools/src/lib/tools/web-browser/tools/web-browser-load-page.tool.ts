import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class WebBrowserLoadPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Load Page',
      metadata: { id: "web-browser", tool: 'loadPage' },
      description: 'Use this to load a page on web browser.',
      schema: z.object({
        url: z.string().describe("valid url to load page on web browser"),
      }),
      func: async ({ url }) => {
        try {
          const currentUrl = await settings.webBrowserService.loadPage(url);

          return `Page loaded on web browser: ${currentUrl}`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
