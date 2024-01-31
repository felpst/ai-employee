import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class WebBrowserLoadUrlTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Load Url',
      metadata: { id: "web-browser", tool: 'loadUrl' },
      description: 'Use this to load an url on web browser.',
      schema: z.object({
        url: z.string().describe("valid url to load page on web browser"),
      }),
      func: async ({ url }: { url: string; }) => {
        try {
          const currentUrl = await settings.browser.loadUrl({ url });

          return `Page loaded on web browser: ${currentUrl}`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
