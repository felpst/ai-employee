import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { IElementFindOptions, elementSchema } from './common/element-schema';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export type ScrollPageProps = {
  direction: 'Vertical' | 'Horizontal';
  scrollTo: number
}

export class WebBrowserScrollPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Scroll Page',
      metadata: { id: "web-browser", tool: 'scrollPage' },
      description: 'Use this tool to scroll page vertically.',
      schema: elementSchema.extend({
        scrollTo: z.number().optional().describe("the location where the page will be scrolled"),
        direction: z.string().default('Vertical').describe("the direction in which the page will be scrolled"),
        findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms."),
      }),
      func: async ({ scrollTo, direction, ...params }: IElementFindOptions & ScrollPageProps) => {
        try {
          const { elementSelector, selectorType } = params
          const options = !!elementSelector && !!selectorType ? { ...params } : null
          const browserService = new WebBrowserService(settings.webBrowser);


          const success = await browserService.scrollPage(scrollTo, direction, options);
          if (!success) throw new Error(`Location scroll unsuccessful`);

          return `Location scroll to ${scrollTo} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
