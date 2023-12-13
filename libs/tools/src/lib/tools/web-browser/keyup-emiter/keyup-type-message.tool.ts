import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { KeyUpService } from './keyup-emiter.service';

export class KeyTypeMessageTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: 'Key Up Type Message',
      metadata: { id: "keyup-emiter", tool: 'emitKey' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        text: z.string().describe("a text to be typed on web browser"),
      }),
      func: async ({ text }) => {
        try {
          const keyUpService = new KeyUpService();
          return await keyUpService.typeMessage(text);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
