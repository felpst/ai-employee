import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { FileManagerToolSettings } from '../file-manager.toolkit';

export class FileManagerUpdateTool extends DynamicStructuredTool {
  constructor(settings: FileManagerToolSettings) {
    super({
      name: 'File Management Update',
      metadata: { id: 'file-management', tool: 'update' },
      description:
        'Use this tool to update file on AiEmployee internal storage.',
      schema: z.object({
        aiEmployeeId: z.string().describe('AiEmployee reference.'),
        file: z.any().describe('new file to be stored by AiEmployee.'),
        filename: z.any().describe('name of the file you want to update.'),
      }),
      func: async ({ aiEmployeeId, file, filename }) => {
        try {
          return await settings.fileManagerService.update({
            aiEmployeeId,
            filename,
            file,
          });
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
