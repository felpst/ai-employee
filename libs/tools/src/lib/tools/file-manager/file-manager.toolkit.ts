import { DynamicStructuredTool, Tool } from 'langchain/tools';
import { FileManagerService } from './file-manager.service';
import { FileManagerCreateTool } from './tools/file-manager-create.tool';

export interface FileManagerToolSettings {
  fileManagerService: FileManagerService;
}

export function FileManagerToolkit(
  settings: FileManagerToolSettings
): DynamicStructuredTool[] | Tool[] {
  return [new FileManagerCreateTool(settings)];
}
