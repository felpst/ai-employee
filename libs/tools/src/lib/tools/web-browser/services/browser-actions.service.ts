import { By, WebDriver } from 'selenium-webdriver';
import { WebBrowser } from '../web-browser';

export default class BrowserActions {
  private _driver: WebDriver;
  constructor(browser: WebBrowser) {
    this._driver = browser.driver;
  }

  async click(selector: string) {
    const element = await this._findElement(selector);
    return element.click();
  }

  async inputText(selector: string, content: string) {
    const element = await this._findElement(selector);
    return element.sendKeys(content);
  }

  async scroll(location: number, selector: string) {
    let _location = location;
    if (!_location) {
      const input = await this._findElement(selector);

      if (!input) return false;
      _location = Number(await input.getAttribute('offsetTop'));
    }
    let currentLocation = 0;
    let offset = _location - currentLocation || 0;
    this._driver.executeScript("window.scrollTo(" + currentLocation + "," + offset + ")");
    await this._driver.sleep(500);

    for (let i = 0; i < 5; i++) {
      console.log(`Waiting for page scroll from ${currentLocation} to ${_location}`);
      currentLocation += offset;

      if (currentLocation >= _location) {
        return true;
      } else {
        offset = _location - currentLocation;
        this._driver.executeScript("window.scrollTo(" + currentLocation + "," + offset + ")");
      }
    }
    return false;
  }

  private async _findElement(selector: string) {
    return this._driver.findElement(By.css(selector));
  }
}