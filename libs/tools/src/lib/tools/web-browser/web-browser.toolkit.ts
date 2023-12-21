import { IWebBrowser } from "@cognum/interfaces";
import { DynamicStructuredTool, Tool } from "langchain/tools";
import { WebBrowserLoadPageTool } from "./tools/web-browser-load-page.tool";
import { WebBrowserInputTextTool } from "./tools/web-browser-input-text.tool";
import { WebBrowserClickTool } from "./tools/web-browser-click.tool";
import { WebBrowserService } from "./web-browser.service";
import { WebBrowserScrollPageTool } from "./tools/web-browser-scroll-page.tool";
import { WebBrowserExtractDataTool } from "./tools/web-browser-extract-data.tool";
import { KeyPressTool } from "./tools/web-browser-key-up-emiter";

export interface WebBrowserToolSettings {
  webBrowserService: WebBrowserService;
}

export function WebBrowserToolkit(settings: WebBrowserToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new WebBrowserLoadPageTool(settings),
    new WebBrowserInputTextTool(settings),
    new WebBrowserClickTool(settings),
    new WebBrowserScrollPageTool(settings),
    new WebBrowserExtractDataTool(settings),
    new KeyPressTool(settings),
  ]
}
