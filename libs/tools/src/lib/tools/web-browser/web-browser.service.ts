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

  async inspectElement(idOrClass: string): Promise<any> {
    try {
      let element;
      if (idOrClass.startsWith('.')) {
        element = await this.webBrowser.driver.findElement({ css: idOrClass });
      } else {
        element = await this.webBrowser.driver.findElement({ id: idOrClass });
      }

      const attributes = await this.webBrowser.driver
        .executeScript("let items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;", element);

      const html = await element.getAttribute('outerHTML');

      return { html, attributes };
    } catch (e) {
      console.error(e);
      return { html: '', attributes: { id: '', class: '', xpath: '' } };
    }
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

  async scrollPage(location: number): Promise<boolean> {
    this.webBrowser.driver.executeScript("window.scrollTo(0," + location + ")");
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 5; i++) {
      console.log(`Waiting for page scroll to: ${location}`);
      const currentLocation: number = await this.webBrowser.driver.executeScript("return window.scrollY");

      if (currentLocation >= location) {
        return true;
      }

      await this.webBrowser.driver.sleep(3000);
    }
    return false;
  }
}
