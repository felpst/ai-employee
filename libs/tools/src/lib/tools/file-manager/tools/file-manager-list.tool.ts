import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { FileManagerToolSettings } from '../file-manager.toolkit';

export class FileManagerListTool extends DynamicStructuredTool {
  constructor(settings: FileManagerToolSettings) {
    super({
      name: 'File Management List',
      metadata: { id: 'file-management', tool: 'list' },
      description:
        'Use this tool to list all files in AiEmployee internal storage.',
      schema: z.object({
        aiEmployeeId: z.string().describe('AiEmployee reference.'),
      }),
      func: async ({ aiEmployeeId }) => {
        try {
          return await settings.fileManagerService.list({ aiEmployeeId });
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
