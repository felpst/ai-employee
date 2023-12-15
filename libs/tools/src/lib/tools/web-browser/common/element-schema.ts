import { z } from 'zod';

const validSelectors: Array<'id' | 'className' | 'name' | 'xpath' | 'css' | 'js' | 'linkText' | 'partialLinkText'> =
  ['id', 'className', 'name', 'xpath', 'css', 'js', 'linkText', 'partialLinkText'];

export const elementSchema = z.object({
  elementSelector: z.string().describe("the selector of the html element."),
  selectorType: z.enum(validSelectors as any).describe("type of the selector."),
  findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms.")
});

type SchemaType = z.infer<typeof elementSchema>;

export type ElementSelector = typeof validSelectors[number];

export interface IElementFindOptions extends SchemaType {
  elementSelector: NonNullable<SchemaType['elementSelector']>;
  selectorType: NonNullable<ElementSelector>;
}
