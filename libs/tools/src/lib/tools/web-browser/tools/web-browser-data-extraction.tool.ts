import { DynamicStructuredTool } from 'langchain/tools';
import { WebBrowserToolSettings } from '../web-browser.toolkit';
import { z } from 'zod';

export class WebBrowserExtractDataTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Data Extraction',
      metadata: { id: 'web-browser', tool: 'dataExtraction' },
      description: 'Use this tool to extract data from inside an element on an web page, such as lists, tables or structured divs/sections.',
      schema: z.object({
        selectorId: z.number().describe('selector-id attribute of the element used as data source.'),
        properties: z.array(z.object({
          name: z.string().describe('name of the property.'),
          selectorId: z.string().describe('selector-id attribute of the property for the first item.'),
          attribute: z.string().describe('the data attribute to be used instead value.').optional(),
          required: z.boolean().describe('indicator that property is required.').optional(),
          type: z.enum(['string', 'number', 'boolean', 'any']).describe('property type.').optional()
        })).describe('definition of the properties to be extracted.')
      }),
      func: async ({ selectorId, properties }) => {
        try {
          const container = settings.browser.page.getSelectorById(selectorId);

          for (const prop of properties) {
            const propSelector = settings.browser.page.getSelectorById(prop.selectorId);
            const selector = await settings.browser.page.getChildRelativeSelector(container, propSelector);

            delete prop['selectorId'];

            prop['selector'] = selector
              .split(' > ')
              .map(tag => tag.split(':')[0]) // remove child specification
              .join(' > ');
          }

          console.log(JSON.stringify({ container, properties }, null, 2));

          const extractData = await settings.browser.dataExtraction({ container, properties });

          const json = JSON.stringify(extractData);
          return json;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
