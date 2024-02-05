import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { Key } from '../keyup-emiter/keyup-emiter.interface';
import { WebBrowserToolSettings, buildToolOutput } from '../web-browser.toolkit';

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
        const params = { key };
        let success = false;
        let message: string;
        // combination = combination?.map((key: string) => Key[key as any]);

        try {
          success = await settings.browser.pressKey({ key });

          message = 'Key pressed!';
        } catch (error) {
          message = error.message;
        } finally {
          return buildToolOutput({
            success,
            message,
            action: {
              method: settings.browser.pressKey.name,
              params
            },
          });
        }
      },
    });
  }
}
