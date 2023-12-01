import { IAIEmployeeMemory } from '@cognum/interfaces';
import { memoryStoreInsert } from './utils/memory-store-insert.util';
import { memoryStoreRetriever } from './utils/memory-store-retriever.util';

export class AIEmployeeMemory {
  constructor(private _memory: IAIEmployeeMemory[] = []) { }

  set(memory: IAIEmployeeMemory[] = []) {
    this._memory = memory;
  }

  get() {
    return this._memory;
  }

  async search(question: string, context: string[] = []) {
    const response = await memoryStoreRetriever(question, this._memory, context);
    return response;
  }

  async instruction(content: string, context: string[] = []) {
    const response = await memoryStoreInsert(content, this._memory, context);
    if (response.updated) {
      this._memory = response.database;
    }
    return response;
  }
}
