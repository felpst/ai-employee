import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { FileManagerToolSettings } from '../file-manager.toolkit';

export class FileManagerDeleteTool extends DynamicStructuredTool {
  constructor(settings: FileManagerToolSettings) {
    super({
      name: 'File Management Delete',
      metadata: { id: 'file-management', tool: 'delete' },
      description:
        'Use this tool to delete files on AiEmployee internal storage.',
      schema: z.object({
        aiEmployeeId: z.string().describe('AiEmployee reference.'),
        filename: z.any().describe('name of the file you want to delete.'),
      }),
      func: async ({ aiEmployeeId, filename }) => {
        try {
          return await settings.fileManagerService.delete({
            aiEmployeeId,
            filename,
          });
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
