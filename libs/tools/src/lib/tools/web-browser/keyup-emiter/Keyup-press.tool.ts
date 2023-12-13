import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { KeyUpService } from './keyup-emiter.service';

export class KeyPressTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: 'Key Up Press',
      metadata: { id: "keyup-emiter", tool: 'emitKey' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        key: z.string().describe("a key to be pressed on web browser"),
      }),
      func: async ({ key }) => {
        try {
          const keyUpService = new KeyUpService();
          return await keyUpService.press(key);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
