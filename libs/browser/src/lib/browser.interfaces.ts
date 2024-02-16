/** Enumeration of every possible data type */
export const EveryType = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'function',
  'any',
] as const;

/** Enumeration of every possible method for Skill Steps */
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
  'elementScroll',
  'clickByCoordinates',
  'replyMessages',
  'replyEmails',
  'switchToTab',
] as const;

export interface Skill {
  name: string;
  description: string;
  /** Inputs for the skill, specified as key-value pairs.
   *
   * @remarks
   * Each key represents the name of an input parameter, and the value is an object with the following properties:
   *   - `type`: The data type of the input parameter (must be one of EveryType).
   *   - `description`: The description of the input parameter.
   * @example
   * {
   *  username: {
   *    type: 'string',
   *    description: 'Username value to login.'
   *  }
   * }
   */
  inputs?: {
    [key: string]: {
      type: (typeof EveryType)[number];
      description: string;
    };
  };
  /** An array of steps to be executed in sequence */
  steps: SkillStep[];
  successMessage?: string;
}

/** Represents the parameters for an specific Skill Step Method */
export type StepParams = { [key: string]: any };

export interface SkillStep {
  method: (typeof SkillStepMethod)[number];
  /** Optional parameters for the skill step.
   *
   * @remarks
   * Should be an object to act as parameter for the method defined in method property.
   * @example
   * // when method is loadUrl
   * {
   *  url: 'https://google.com'
   * }
   */
  params?: StepParams;
  successMessage?: string;
}

/** Represents a property to be extracted in data extraction */
export interface DataExtractionProperty {
  name: string;
  method?: (typeof SkillStepMethod)[number];
  params?: any;
  selector?: string;
  attribute?: string;
  innerAttribute?: string;
  required?: boolean;
  type?: (typeof EveryType)[number];
}

export interface DataExtractionParams {
  /** The selector of the data container element */
  container: string;
  /** Represents the properties to be extracted */
  properties: DataExtractionProperty[];
  /** Key to save the extracted data in memory */
  saveOn?: string;
}

export interface LoopParams {
  /** The number of times to execute the sequence of steps */
  times: number;
  steps: SkillStep[];
}

export interface IfParams {
  /** The condition to check
   * @example
   * browserMemory.currentUrl.includes('google.com')
   */
  condition: string;
  steps: SkillStep[];
}

export abstract class BrowserActions
  implements Record<(typeof SkillStepMethod)[number], (...args: any[]) => void>
{
  abstract loadUrl(params: { url: string }): void;
  abstract click(params: {
    selector: string;
    sleep?: number;
    ignoreNotExists?: boolean;
  }): void;
  abstract inputText(params: { selector: string; content: string }): void;
  abstract sleep(params: { time: number }): void;
  abstract scroll(params: { pixels: number }): void;
  abstract dataExtraction(params: DataExtractionParams): void;
  abstract loop(params: LoopParams): void;
  abstract saveOnFile(params: { fileName: string; memoryKey: string }): void;
  abstract if(params: IfParams): void;
  abstract switchToFrame(params: { selector: string }): void;
  abstract switchToDefaultContent(): void;
  abstract pressKey(params: { key: string }): void;
  abstract clickByText(params: {
    text: string;
    tagName: string;
    sleep?: number;
    ignoreNotExists?: boolean;
  }): void;
  abstract elementScroll(params: {
    selector: string;
    pixels: number;
    direction: 'vertical' | 'horizontal';
    useCurrentScroll: boolean;
  }): void;
  abstract clickByCoordinates(params: {
    x: number;
    y: number;
    sleep?: number;
  }): void;
  abstract replyMessages(params: {
    messagesKey: string;
    inputSelector: string;
    buttonSelector: string;
  }): void;
  abstract replyEmails(params: {
    emailsKey: string;
    inputSelector: string;
    buttonSelector: string;
  }): void;
  abstract switchToTab(params: { index: number }): void;
}
