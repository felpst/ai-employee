import { DynamicStructuredTool, Tool } from 'langchain/tools';
import { FileManagerService } from './file-manager.service';
import { FileManagerCreateTool } from './tools/file-manager-create.tool';
import { FileManagerReadTool } from './tools/file-manager-read.tool';
import { FileManagerUpdateTool } from './tools/file-manager-update.tool';
import { FileManagerDeleteTool } from './tools/file-manager-delete.tool';
import { FileManagerListTool } from './tools/file-manager-list.tool';

export interface FileManagerToolSettings {
  fileManagerService: FileManagerService;
}

export function FileManagerToolkit(
  settings: FileManagerToolSettings
): DynamicStructuredTool[] | Tool[] {
  return [
    new FileManagerCreateTool(settings),
    new FileManagerReadTool(settings),
    new FileManagerUpdateTool(settings),
    new FileManagerDeleteTool(settings),
    new FileManagerListTool(settings),
  ];
}
