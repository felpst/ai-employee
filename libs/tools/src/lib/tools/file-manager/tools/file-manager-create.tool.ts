import { DynamicStructuredTool } from '@langchain/community/tools/dynamic';
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
        aiEmployeeId: z.string().describe('AiEmployee reference.'),
        file: z.any().describe('file to be created in AiEmployee storage.'),
      }),
      func: async ({ aiEmployeeId, file }) => {
        try {
          return await settings.fileManagerService.create({
            aiEmployeeId,
            file,
          });
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
