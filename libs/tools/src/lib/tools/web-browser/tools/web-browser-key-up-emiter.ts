import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Key } from '../keyup-emiter/keyup-emiter.interface';
import { WebBrowserService } from '../services/web-browser.service';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class KeyPressTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Key Up Press',
      metadata: { id: "web-browser", tool: 'Key-emiter' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        key: z.enum(Object.keys(Key) as any).describe("a key to be pressed on web browser"),
        combination: z.array(
          z.enum(Object.keys(Key) as any).describe("a combination of keys that will to be pressed with the key on web browser")
        ).optional()
      }),
      func: async ({ key, combination }) => {
        key = Key[key as any];
        combination = combination?.map((key: string) => Key[key as any]);

        try {
          return await settings.webBrowserService.keyupEmiter(key, combination);
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
