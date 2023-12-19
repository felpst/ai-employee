import { IWebBrowser } from "@cognum/interfaces";
import { DynamicStructuredTool, Tool } from "langchain/tools";
import { WebBrowserLoadPageTool } from "./tools/web-browser-load-page.tool";
import { WebBrowserInputTextTool } from "./tools/web-browser-input-text.tool";
import { WebBrowserClickTool } from "./tools/web-browser-click.tool";
import { WebBrowserService } from "./web-browser.service";

export interface WebBrowserToolSettings {
  webBrowserService: WebBrowserService;
}

export function WebBrowserToolkit(settings: WebBrowserToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new WebBrowserLoadPageTool(settings),
    new WebBrowserInputTextTool(settings),
    new WebBrowserClickTool(settings),
    // new KeyPressTool(settings),
    // new WebBrowserFindElementTool(settings)
  ]
}
