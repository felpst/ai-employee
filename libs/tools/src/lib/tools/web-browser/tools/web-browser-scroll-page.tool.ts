import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { IElementFindOptions, elementSchema } from '../common/element-schema';
import { WebBrowserService } from '../services/web-browser.service';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export type ScrollPageProps = {
  direction: 'Vertical' | 'Horizontal';
  scrollTo: number
}

export class WebBrowserScrollPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Scroll Page',
      metadata: { id: "web-browser", tool: 'scrollPage' },
      description: 'Use this tool to scroll page vertically and get access to elements outside ViewPort.',
      schema: elementSchema.extend({
        location: z.number().optional().describe("how much in pixels will be scrolled"),
      }),
      func: async ({ scrollTo, direction, ...params }: IElementFindOptions & ScrollPageProps) => {
        try {

          // const success = await settings.webBrowserService.scrollPage(location, params);
          // if (!success) throw new Error(`Location scroll unsuccessful`);

          return `Location scroll to ${scrollTo} was successfully done`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
