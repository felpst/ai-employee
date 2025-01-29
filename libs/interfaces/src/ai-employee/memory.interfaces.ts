export interface IAIEmployeeMemory {
  pageContent: string;
  metadata?: { [key: string]: any }
}

export interface IMemorySearchResult {
  answer?: string;
  accuracy?: boolean;
}

export interface IMemoryInstructionResult {
  database: IAIEmployeeMemory[];
  details?: string;
  updated: boolean;
}
