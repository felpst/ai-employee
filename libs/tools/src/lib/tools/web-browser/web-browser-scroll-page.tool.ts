import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserScrollPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Scroll Page',
      metadata: { id: "web-browser", tool: 'scrollPage' },
      description: 'Use this tool to scroll page vertically.',
      schema: z.object({
        location: z.number().describe("the location where the page will be scrolled")
      }),
      func: async ({ location }: { location: number; }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);

          const success = await browserService.scrollPage(location);
          if (!success) throw new Error(`Location scroll unsuccessful`);

          return `Location scroll to ${location} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
