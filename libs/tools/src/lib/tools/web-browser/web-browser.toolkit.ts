import { DynamicStructuredTool, Tool } from "langchain/tools";
import { WebBrowserLoadUrlTool } from "./tools/web-browser-load-url.tool";
import { WebBrowserInputTextTool } from "./tools/web-browser-input-text.tool";
import { WebBrowserClickTool } from "./tools/web-browser-click.tool";
import { WebBrowserScrollPageTool } from "./tools/web-browser-scroll-page.tool";
import { WebBrowserExtractDataTool } from "./tools/web-browser-data-extraction.tool";
import { KeyPressTool } from "./tools/web-browser-press-key";
import { WebBrowser } from '@cognum/browser';

export interface WebBrowserToolSettings {
  browser: WebBrowser;
}

export interface WebBrowserToolOutput {
  success: boolean,
  message: string,
  input?: object,
  result?: string;
}

export function buildToolOutput({ success, message, input, result }: WebBrowserToolOutput) {
  let res = `${success ? 'Success' : 'Error'}: ${message}`;
  if (input)
    res += `\n\nService Input:\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\``;
  if (result)
    res += `\n\nService Response: ${result}`;

  return res;
}

export function WebBrowserToolkit(settings: WebBrowserToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new WebBrowserLoadUrlTool(settings),
    new WebBrowserInputTextTool(settings),
    new WebBrowserClickTool(settings),
    new WebBrowserScrollPageTool(settings),
    new WebBrowserExtractDataTool(settings),
    new KeyPressTool(settings),
  ];
}
