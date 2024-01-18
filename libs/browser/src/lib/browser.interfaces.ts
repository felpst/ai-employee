export type SkillInputType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'any';
export type SkillStepMethod = 'loadUrl' | 'click' | 'inputText' | 'sleep' | 'scroll' | 'dataExtraction' | 'loop' | 'saveOnFile';

export interface Skill {
  name: string;
  description: string;
  inputs?: { [key: string]: { type: SkillInputType, description: string } };
  steps: { method: SkillStepMethod, params: { [key: string]: any } }[];
}


export interface DataExtractionProperty {
  name: string;
  selector: string;
}
