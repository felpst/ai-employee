export const EveryType = ['string', 'number', 'boolean', 'object', 'array', 'function', 'any'] as const;
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

export interface Skill {
  name: string;
  description: string;
  inputs?: {
    [key: string]: {
      type: typeof EveryType[number],
      description: string;
    };
  };
  steps: SkillStep[];
  successMessage?: string;
}
export type StepParams = { [key: string]: any; };
export interface SkillStep {
  method: typeof SkillStepMethod[number];
  params?: StepParams;
  successMessage?: string;
}
export interface DataExtractionProperty {
  name: string;
  selector?: string;
  attribute?: string;
  required?: boolean;
  type?: typeof EveryType[number];
}
export interface DataExtractionParams {
  container: string;
  properties: DataExtractionProperty[];
  saveOn?: string;
}
export interface LoopParams {
  times: number;
  steps: SkillStep[];
}

export interface IfParams {
  condition: string;
  steps: SkillStep[];
}

export abstract class BrowserActions implements Record<typeof SkillStepMethod[number], (...args: any[]) => void> {
  /**
   * Loads a page by url
   */
  abstract loadUrl(params: { url: string; }): void;
  abstract click(params: { selector: string; sleep?: number; }): void;
  abstract inputText(params: { selector: string; content: string; }): void;
  abstract sleep(params: { time: number; }): void;
  abstract scroll(params: { pixels: number; }): void;
  abstract dataExtraction(params: DataExtractionParams): void;
  abstract loop(params: LoopParams): void;
  abstract saveOnFile(params: { fileName: string; memoryKey: string; }): void;
  abstract if(params: IfParams): void;
  abstract switchToFrame(params: { selector: string; }): void;
  abstract switchToDefaultContent(): void;
  abstract pressKey(params: { key: string; }): void;
  abstract clickByText(params: { text: string; tagName: string; sleep?: number; }): void;
}