export type SkillInputType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'any';
export type SkillStepMethod = 'loadUrl' | 'click' | 'inputText' | 'sleep' | 'scroll' | 'findMultiplesElementsToClick' | 'extractData' | 'loop';

export interface Skill {
  name: string;
  description: string;
  inputs?: { [key: string]: { type: SkillInputType, description: string } };
  steps: { method: SkillStepMethod, params: { [key: string]: any } }[];
}


export interface DataCollection {
  name: string;
  selector: string;
  position: number;
}