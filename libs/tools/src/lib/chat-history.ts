import { DynamicTool } from 'langchain/tools';
import { AIEmployeeMemory } from './memories/ai_employee.memory';

export class ChatHistoryTool extends DynamicTool {
  constructor(memory: AIEmployeeMemory) {
    super({
      name: 'Chat History',
      description:
        'Use this when you need search informations you dont know and possible to find in chat history. Input should be a question.',
      func: async (input: string) => {
        if (memory.vectorStore.length() < 10) {
          return 'Not enough data to search.';
        }
        const docs = await memory.queryMemory(input);
        return docs.map(doc => doc.pageContent).join('\n');
      },
    });
  }
}
