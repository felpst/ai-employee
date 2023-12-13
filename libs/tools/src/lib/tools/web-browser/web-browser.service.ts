import { By, until } from 'selenium-webdriver';
import { WebBrowser } from "./web-browser";

export interface IElementFindOptions {
  fieldSelector: string,
  selectorType: keyof typeof ElementSelector,
  findTimeout?: number;
}

export enum ElementSelector {
  'id',
  'className',
  'name',
  'xpath',
  'css',
  'js',
  'linkText',
  'partialLinkText'
}

export class WebBrowserService {
  constructor(
    private webBrowser: WebBrowser
  ) { }

  async loadPage(url: string): Promise<boolean> {
    this.webBrowser.driver.get(url);
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 3; i++) {
      console.log(`Waiting for page load: ${url}`);
      const currentUrl = await this.webBrowser.driver.getCurrentUrl();
      if (currentUrl.includes(url)) {
        return true;
      }
      await this.webBrowser.driver.sleep(5000);
    }
    return false;
  }

  async inputText(text: string, options: IElementFindOptions): Promise<boolean> {
    const userInput =
      await this.webBrowser.driver.wait(
        until.elementLocated(By[options.selectorType](options.fieldSelector)),
        options.findTimeout
      );

    if (!userInput) return false;
    await userInput.sendKeys(text);

    return true;
  }
}
