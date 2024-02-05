import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

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
        let message: string;
        let result: string;
        const params = { url };

        try {
          result = await settings.browser.loadUrl(params);
          message = 'Page loaded!';
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success: !!result,
            message,
            action: {
              method: settings.browser.loadUrl.name,
              params
            },
            ...(result && {
              result: `Current page is now "${result}"`
            })
          });
        }
      },
    });
  }
}
