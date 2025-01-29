import { ITool } from '@cognum/interfaces';
import tools from './tools';

export class ToolsHelper {
  static _map: Map<string, ITool> = new Map<string, ITool>();

  static get tools() {
    return tools;
  }

  static get(id: string) {
    return tools.filter(tool => tool.id === id)[0];
  }

}
