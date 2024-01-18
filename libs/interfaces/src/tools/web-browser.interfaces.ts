import { WebDriver } from "selenium-webdriver";

export type BrowserType = 'chrome' | 'brightdata';

export interface IWebBrowserOptions {
  aiEmployeeId?: string;
  browser?: BrowserType;
  proxy?: boolean;
  headless?: boolean;
}

export interface IWebBrowser {
  options: IWebBrowserOptions;
  driver: WebDriver;
  timeoutMS: number;

  start(options?: IWebBrowserOptions): Promise<IWebBrowser>;
  close(): Promise<void>;
}
