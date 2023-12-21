import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Key } from '../keyup-emiter/keyup-emiter.interface';
import { WebBrowserService } from '../web-browser.service';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class KeyPressTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Key Up Press',
      metadata: { id: "web-browser", tool: 'Key-emiter' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        key: z.nativeEnum(Key).describe("a key to be pressed on web browser"),
        combination: z.nativeEnum(Key).describe("a array of keys that will to be pressed with the key on web browser").optional()
      }),
      func: async ({ key, combination }) => {
        try {
          return await settings.webBrowserService.keyupEmiter(key, combination);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
