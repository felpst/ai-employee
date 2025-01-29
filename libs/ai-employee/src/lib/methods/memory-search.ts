import { memorySearch } from '../memory/utils/memory-search.util';

export async function aiEmployeeMemorySearch(question: string, context: string[] = []) {
  return await memorySearch(this.memory, question, context);
}
