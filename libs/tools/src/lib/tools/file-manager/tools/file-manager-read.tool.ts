import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { FileManagerToolSettings } from '../file-manager.toolkit';

export class FileManagerReadTool extends DynamicStructuredTool {
  constructor(settings: FileManagerToolSettings) {
    super({
      name: 'File Management Read',
      metadata: { id: 'file-management', tool: 'read' },
      description:
        'Use this tool to read files on AiEmployee internal storage.',
      schema: z.object({
        aiEmployeeId: z.string().describe('AiEmployee reference.'),
        filename: z.any().describe('name of the file you want to read.'),
      }),
      func: async ({ aiEmployeeId, filename }) => {
        try {
          return await settings.fileManagerService.read({
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
