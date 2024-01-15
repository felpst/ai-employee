import { IWebBrowser } from '@cognum/interfaces';
import { By, until } from 'selenium-webdriver';
import { IElementFindOptions } from './common/element-schema';
import { ExtractDataUseCase } from './usecases/extract-data.usecase';
import WebBrowserUtils from './web-browser-utils';

export class WebBrowserService {
  private _currentURL: string;
  private _utils: WebBrowserUtils;
  private _selectors: Record<string, string>;

  constructor(
    private webBrowser: IWebBrowser
  ) {
    this._utils = new WebBrowserUtils(this.webBrowser);
  }

  async checkCurrentURLUpdated() {
    const currentURL = await this.webBrowser.driver.getCurrentUrl();
    if (this._currentURL === currentURL) return false;
    this._currentURL = currentURL;
    this.webBrowser.driver.wait(async () => {
      const readyState = await this.webBrowser.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 10000);

    return true;
  }

  async loadPage(url: string): Promise<boolean> {
    this.webBrowser.driver.get(url);
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 3; i++) {
      console.log(`Waiting for page load: ${url}`);
      const currentUrl = await this.webBrowser.driver.getCurrentUrl();
      if (currentUrl.includes(url)) {
        await this.checkCurrentURLUpdated();
        return true;
      }
    }
    return false;
  }

  async getCurrentUrl(): Promise<string> {
    return this.webBrowser.driver.getCurrentUrl();
  }

  async click(options: IElementFindOptions) {
    const element =
      await this.webBrowser.driver.wait(
        until.elementLocated(By[options.selectorType](options.elementSelector)),
        options.findTimeout
      );

    if (!element) return false;
    await element.click();
    await this.checkCurrentURLUpdated();
    return true;
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
    const userInput = await this._findElement(options);

    if (!userInput) return false;
    await userInput.sendKeys(text);

    return true;
  }

  async clickElement(options: IElementFindOptions): Promise<boolean> {
    const element = await this._findElement(options);

    if (!element) return false;
    await element.click();
    await this.checkCurrentURLUpdated();

    return true;
  }

  async getPageSource(): Promise<string> {
    const source = await this._utils.getElementHtmlBySelector('body');
    return source;
  }

  async scrollPage(location?: number, options?: IElementFindOptions): Promise<boolean> {
    let _location = location;
    if (!_location) {
      const input = await this._findElement(options);

      if (!input) return false;
      _location = Number(await input.getAttribute('offsetTop')); //scrollHeight

    }
    let currentLocation = 0;
    let offset = _location - currentLocation || 0;
    this.webBrowser.driver.executeScript("window.scrollTo(" + currentLocation + "," + offset + ")");
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 5; i++) {
      console.log(`Waiting for page scroll from ${currentLocation} to ${_location}`);
      currentLocation += offset;

      if (currentLocation >= _location) {
        return true;
      } else {
        offset = _location - currentLocation;
        this.webBrowser.driver.executeScript("window.scrollTo(" + currentLocation + "," + offset + ")");
      }
    }
    return false;
  }

  async extractData(cssSelector: string) {
    return new ExtractDataUseCase(this.webBrowser).execute(cssSelector);
  }

  async keyupEmiter(key: string, combination?: string[]): Promise<string> {
    if (combination) {
      combination.map(async k => await this.webBrowser.driver.actions().keyDown(k).perform());
      return await this.webBrowser.driver.actions().keyDown(key).perform().then(
        async () => {
          await this.webBrowser.driver.actions().keyUp(key).perform();
          combination.map(async k => await this.webBrowser.driver.actions().keyUp(k).perform());
          await this.checkCurrentURLUpdated();
          return `Keys ${key}, ${combination.join(',')} pressed`;
        },
        (error) => {
          return error.message;
        }
      );
    } else {
      return await this.webBrowser.driver.actions().keyDown(key).perform().then(
        async () => {
          await this.webBrowser.driver.actions().keyUp(key).perform();
          await this.checkCurrentURLUpdated();
          return `Key ${key} pressed`;
        },
        (error) => {
          return error.message;
        }
      );
    }
  }

  findElementById(selectorId: number): string {
    const selector = this._selectors[selectorId];

    if (!selector)
      throw new Error(`Element not found for selector id "${selectorId}".`);

    return selector;
  }



  private async _findElement(findOptions: IElementFindOptions) {
    return this.webBrowser.driver.wait(
      until.elementLocated(By[findOptions.selectorType](findOptions.elementSelector)),
      findOptions.findTimeout
    );
  }

  async getVisibleHtml() {
    const { html, selectors } = await this._utils.getVisibleHtmlAndSelectors();
    this._selectors = selectors;

    return `\`\`\`html
    ${html}
    \`\`\``;
  }

  async getPageSize() {
    return this.webBrowser.driver.executeScript<{ height: number, width: number; }>(() => {
      const height = document.querySelector('body').scrollHeight;
      const width = document.querySelector('body').scrollWidth;

      return {
        height,
        width
      };
    });
  }
}
