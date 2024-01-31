import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Key } from '../keyup-emiter/keyup-emiter.interface';
import { WebBrowserToolSettings } from '../web-browser.toolkit';

export class KeyPressTool extends DynamicStructuredTool {
  constructor(settings: WebBrowserToolSettings) {
    super({
      name: 'Web Browser Press Key',
      metadata: { id: "web-browser", tool: 'pressKey' },
      description: 'Use this tool to press a key on web browser.',
      schema: z.object({
        key: z.enum(Object.keys(Key) as any).describe("a key to be pressed on web browser"),
        // combination: z.array(
        //   z.enum(Object.keys(Key) as any).describe("a combination of keys that will to be pressed with the key on web browser")
        // ).optional()
      }),
      func: async ({ key, combination }) => {
        key = Key[key as any];
        // combination = combination?.map((key: string) => Key[key as any]);

        try {
          await settings.browser.pressKey({ key });

          return `Key "${key}" pressed.`;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
