import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Key } from './keyup-emiter.interface';
import { KeyUpService } from './keyup-emiter.service';

export class KeyPressTool extends DynamicStructuredTool {
  constructor() {
    super({
      name: 'Key Up Press',
      metadata: { id: "keyup-emiter", tool: 'emitKey' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        key: z.nativeEnum(Key).describe("a key to be pressed on web browser"),
        combination: z.nativeEnum(Key).describe("a array of keys that will to be pressed with the key on web browser").optional()
      }),
      func: async ({ key, combination }) => {
        try {
          const keyUpService = new KeyUpService();
          return await keyUpService.press(key, combination);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
