import { z } from 'zod';

export const ELEMENT_SELECTORS = ['id', 'name', 'xpath', 'css', 'js', 'linkText', 'partialLinkText'] as const;

export const elementSchema = z.object({
  elementSelector: z.string().describe("the selector of the html element."),
  selectorType: z.enum(ELEMENT_SELECTORS).describe("type of the selector."),
  findTimeout: z.number().optional().default(10000).describe("timeout to find the element in ms.")
});

type SchemaType = z.infer<typeof elementSchema>;

export type ElementSelector = typeof ELEMENT_SELECTORS[number];

export interface IElementFindOptions extends SchemaType {
  elementSelector: NonNullable<SchemaType['elementSelector']>;
  selectorType: NonNullable<SchemaType['selectorType']>;
}
