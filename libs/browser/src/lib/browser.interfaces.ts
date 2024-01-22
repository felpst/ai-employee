export type SkillInputType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'any';
export type SkillStepMethod = 'loadUrl' | 'click' | 'doubleClick' | 'inputText' | 'sleep' | 'scroll' | 'dataExtraction' | 'loop' | 'saveOnFile' | 'if' | 'test' | 'switchToFrame' | 'switchToDefaultContent' | "pressKey";

export interface Skill {
  name: string;
  description: string;
  inputs?: { [key: string]: { type: SkillInputType, description: string } };
  steps: SkillStep[];
  successMessage?: string;
}

export interface SkillStep {
  method: SkillStepMethod;
  params?: { [key: string]: any };
  successMessage?: string;
}


export interface DataExtractionProperty {
  name: string;
  selector?: string;
  attribute?: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'any';
}
