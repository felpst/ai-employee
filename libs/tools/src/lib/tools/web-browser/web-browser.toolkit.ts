import { DynamicStructuredTool, Tool } from "langchain/tools";
import { KeyPressTool } from './keyup-emiter/Keyup-press.tool';
import { KeyTypeMessageTool } from './keyup-emiter/keyup-type-message.tool';
import { WebBrowser } from "./web-browser";
import { WebBrowserFindElementTool } from "./web-browser-find-components.tool";
import { WebBrowserLoadPageTool } from "./web-browser-load-page.tool";

export interface WebBrowserToolSettings {
  webBrowser: WebBrowser;
}

export function WebBrowserToolkit(settings: WebBrowserToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new WebBrowserLoadPageTool(settings),
    new KeyPressTool(),
    new KeyTypeMessageTool(),
    new WebBrowserFindElementTool(settings)
  ]
}
