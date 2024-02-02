import { DynamicStructuredTool } from 'langchain/tools';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';
import { z } from 'zod';
import { DataExtractionParams, EveryType } from '@cognum/browser';

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
          type: z.enum(EveryType).describe('property type.').optional()
        })).describe('definition of the properties to be extracted.'),
        saveOn: z.string().describe('browser memory key where to save data on.').optional()
      }),
      func: async ({ selectorId, properties }) => {
        let message: string;
        let result: string;
        let input: DataExtractionParams;

        try {
          let container = settings.browser.page.getSelectorById(selectorId);

          const containerEl = await settings.browser.driver.findElement({ css: container });
          let hasTBody = false;
          if (await containerEl.getTagName() === 'table') {
            hasTBody = !!(await containerEl.findElement({ tagName: 'tbody' })
              .then(r => r)
              .catch(() => null));
          }

          for (const prop of properties) {
            const propSelector = settings.browser.page.getSelectorById(prop.selectorId);
            const selector = await settings.browser.page.getChildRelativeSelector(container, propSelector);

            delete prop['selectorId'];

            prop['selector'] = selector.split(' > ')
              .slice(hasTBody ? 3 : 2) // explained on next if
              .join(' > ');
          }
          if (hasTBody) container += ' > tbody'; // change container context to inside table body

          input = { container, properties };

          result = await settings.browser.dataExtraction(input);
          message = 'The data was extracted!';
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success: !!result,
            message,
            input,
            result
          });
        }
      },
    });
  }
}
