import { DynamicStructuredTool, Tool } from "langchain/tools";
import { WebBrowser } from "./web-browser";
import { WebBrowserFindElementTool } from "./web-browser-find-element.tool";
import { KeyPressTool } from "./web-browser-key-up-emiter";
import { WebBrowserLoadPageTool } from "./web-browser-load-page.tool";

export interface WebBrowserToolSettings {
  webBrowser: WebBrowser;
}

export function WebBrowserToolkit(settings: WebBrowserToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new WebBrowserLoadPageTool(settings),
    new KeyPressTool(settings),
    new WebBrowserFindElementTool(settings)
  ]
}
