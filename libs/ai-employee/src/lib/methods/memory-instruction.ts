import { memoryInstruction } from '../memory/utils/memory-instruction.util';

export async function aiEmployeeMemoryInstruction(instruction: string, context: string[] = []) {
  const result = await memoryInstruction(this.memory, instruction, context);
  if (result.updated) {
    this.memory = result.database;
    await this.save()
  }
  return result;
}
