import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { ElementSelector, IElementFindOptions, WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserScrollPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Scroll Page',
      metadata: { id: "web-browser", tool: 'scrollPage' },
      description: 'Use this tool to scroll page vertically.',
      schema: z.object({
        location: z.number().optional().describe("the location where the page will be scrolled"),
        fieldSelector: z.string().optional().describe("the selector of the html field element"),
        selectorType: z.nativeEnum(ElementSelector).optional().describe("type of the selector"),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the input element in ms")
      }),
      func: async ({ location, ...params }: IElementFindOptions & { location: number; }) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);

          const success = await browserService.scrollPage(location, params);
          if (!success) throw new Error(`Location scroll unsuccessful`);

          return `Location scroll to ${location} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
