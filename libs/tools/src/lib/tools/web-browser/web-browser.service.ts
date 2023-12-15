import { IWebBrowser } from '@cognum/interfaces';
import { By, until } from 'selenium-webdriver';
import { IElementFindOptions } from './common/element-schema';
import { ExtractDataUseCase } from './usecases/extract-data.usecase';
import { FindElementUseCase } from './usecases/find-element.usecase';

export class WebBrowserService {
  constructor(
    private webBrowser: IWebBrowser
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

  async click(options: IElementFindOptions) {
    const element =
      await this.webBrowser.driver.wait(
        until.elementLocated(By[options.selectorType](options.elementSelector)),
        options.findTimeout
      );

    if (!element) return false;
    await element.click();

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

    return true;
  }

  async findElementByContext(context: string): Promise<any> {
    const element = await new FindElementUseCase(this.webBrowser).execute(context);
    return element;
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
        await this.webBrowser.driver.sleep(3000);
        offset = _location - currentLocation;
        this.webBrowser.driver.executeScript("window.scrollTo(" + currentLocation + "," + offset + ")");
      }

    }
    return false;
  }

  async extractData(findOptions: IElementFindOptions) {
    return new ExtractDataUseCase(this.webBrowser).execute(findOptions);
  }

  async keyupEmiter(key: string, combination?: string[]): Promise<string> {
    if (combination) {
      combination.map(async k => await this.webBrowser.driver.actions().keyDown(k).perform());
      return await this.webBrowser.driver.actions().keyDown(key).perform().then(
        async () => {
          await this.webBrowser.driver.actions().keyUp(key).perform();
          combination.map(async k => await this.webBrowser.driver.actions().keyUp(k).perform());
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
          return `Key ${key} pressed`;
        },
        (error) => {
          return error.message;
        }
      );
    }
  }

  private async _findElement(findOptions: IElementFindOptions) {
    return this.webBrowser.driver.wait(
      until.elementLocated(By[findOptions.selectorType](findOptions.elementSelector)),
      findOptions.findTimeout
    );
  }
}
