import { DynamicStructuredTool } from 'langchain/tools';
import { IElementFindOptions, elementSchema } from './common/element-schema';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserClickTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Click',
      metadata: { id: "web-browser", tool: 'click' },
      description: 'Use this tool to click an element on an web browser page.',
      schema: elementSchema,
      func: async ({
        elementSelector,
        selectorType,
        findTimeout
      }: IElementFindOptions) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);

          const success = await browserService.clickElement({
            elementSelector,
            selectorType,
            findTimeout
          });
          if (!success) throw new Error("It was'nt possible to click the element");

          return 'The element was successfully clicked';
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
