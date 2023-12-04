import { IAIEmployeeMemory } from "@cognum/interfaces";

export interface IMemorySearchResult {
  answer?: string;
  accuracy?: boolean;
}

export interface IMemoryInstructionResult {
  database: IAIEmployeeMemory[];
  details?: string;
  updated: boolean;
}
