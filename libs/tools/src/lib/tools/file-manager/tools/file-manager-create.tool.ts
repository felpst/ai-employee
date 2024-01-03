import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { FileManagerToolSettings } from '../file-manager.toolkit';

export class FileManagerCreateTool extends DynamicStructuredTool {
  constructor(settings: FileManagerToolSettings) {
    super({
      name: 'File Management Create',
      metadata: { id: 'file-management', tool: 'create' },
      description:
        "Use this to create files on the employee's internal storage.",
      schema: z.object({
        context: z.string().describe('context of the file to be created.'),
        content: z.string().describe('content of the file to be created.'),
        format: z.string().describe('format of the file to be created.'),
        createTimeout: z
          .number()
          .optional()
          .default(10000)
          .describe('timeout to find the element in ms.'),
      }),
      func: async ({ context, createTimeout, ...rest }) => {
        try {
          console.log({ context, createTimeout, ...rest });
          return true;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
