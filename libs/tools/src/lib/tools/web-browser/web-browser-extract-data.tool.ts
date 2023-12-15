import { DynamicStructuredTool } from 'langchain/tools';
import { IElementFindOptions, elementSchema } from './common/element-schema';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserExtractDataTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Extract Data',
      metadata: { id: "web-browser", tool: 'extractData' },
      description: 'Use this tool to extract data from an element on an web page.',
      schema: elementSchema,
      func: async ({
        context,
        elementSelector,
        selectorType,
        findTimeout
      }: IElementFindOptions) => {
        try {
          const browserService = new WebBrowserService(settings.webBrowser);
          await browserService.findElementByContext(context)
          const extractData = await browserService.extractData({
            elementSelector,
            selectorType,
            findTimeout
          });
          const json = JSON.stringify(extractData);
          console.log(json);
          return json;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
