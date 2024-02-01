import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { IElementFindOptions, elementSchema } from '../common/element-schema';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

export type ScrollPageProps = {
  direction: 'Vertical' | 'Horizontal';
  pixels: number;
};

export class WebBrowserScrollPageTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Scroll',
      metadata: { id: "web-browser", tool: 'scroll' },
      description: 'Use this tool to scroll page vertically and get access to elements outside ViewPort.',
      schema: elementSchema.extend({
        pixels: z.number().optional().describe("how much in pixels will be scrolled"),
        // direction: z.enum(['Vertical', 'Horizontal']).optional().describe("scroll direction"),
      }),
      func: async ({ pixels, direction }: IElementFindOptions & ScrollPageProps) => {
        const input = { pixels };
        let success = false;
        let message: string;

        try {
          success = await settings.browser.scroll({ pixels });

          message = `Scrolled ${pixels}px!`;
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success,
            message,
            input,
          });
        }
      },
    });
  }
}
