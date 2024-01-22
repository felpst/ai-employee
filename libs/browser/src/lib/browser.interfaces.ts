export const SkillInputType = ['string', 'number', 'boolean', 'object', 'array', 'function', 'any'] as const;
export const SkillStepMethod = [
  'loadUrl',
  'click',
  'inputText',
  'sleep',
  'scroll',
  'dataExtraction',
  'loop',
  'saveOnFile',
  'if',
  'switchToFrame',
  'switchToDefaultContent',
  'pressKey',
  'clickByText',
] as const;

export interface WebBrowserShared extends Record<typeof SkillStepMethod[number], (...args: any) => any> { }

export interface Skill {
  name: string;
  description: string;
  inputs?: {
    [key: string]: {
      type: typeof SkillInputType[number],
      description: string;
    };
  };
  steps: SkillStep[];
  successMessage?: string;
}

export type Param = { [key: string]: any; };

export interface SkillStep {
  method: typeof SkillStepMethod[number];
  params?: Param;
  successMessage?: string;
}

export interface DataExtractionProperty {
  name: string;
  selector?: string;
  attribute?: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'any';
}
