import { IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import { ProxyPlugin } from 'selenium-chrome-proxy-plugin';
import { Browser, Builder, By, WebDriver, WebElement } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { DataExtractionProperty } from '../browser.interfaces';
import * as fs from 'fs';

export class WebBrowser {
  driver: WebDriver
  memory: any = {};

  async open(options: IWebBrowserOptions = {}) {
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      let chromeOptions = new Options();
      if (options.headless) chromeOptions.addArguments('--headless=new');
      chromeOptions.addArguments('--window-size=1366,768');

      const prefs = {
        'profile.default_content_setting_values.media_stream_camera': 1,
        'profile.default_content_setting_values.media_stream_mic': 1,
        'profile.default_content_setting_values.notifications': 1,
        'profile.default_content_setting_values.geolocation': 0,
      };
      chromeOptions.setUserPreferences(prefs);

      const proxyConfig = {
        host: 'brd.superproxy.io',
        port: '22225',
        username: 'brd-customer-hl_6ba6b478-zone-isp',
        password: 'eov6rhd8t0cr',
        tempDir: '/tmp'
      };

      // Proxy options
      if (options.proxy) {
        chromeOptions = await new ProxyPlugin({
          proxyConfig,
          chromeOptions
        })
      }

      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .build();
      console.log('Driver started...');
    } catch (error) {
      console.error(error)
      throw new Error(error.message);
    }
  }

  async close() {
    await this.driver.quit();
  }

  async loadUrl({ url }: { url: string; }): Promise<boolean> {
    this.driver.get(url);
    await this.driver.sleep(500);
    for (let i = 0; i < 3; i++) {
      const currentUrl = await this.driver.getCurrentUrl();
      if (currentUrl.includes(url)) {
        return true;
      }
    }
    return false;
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async click({ selector, sleep }: { selector: string, sleep?: number }) {
    const element = await this._findElement(selector);
    await element.click();
    if (sleep) await this.driver.sleep(sleep);
  }

  async inputText({ selector, content }: { selector: string, content: string }) {
    const element = await this._findElement(selector);
    return element.sendKeys(content);
  }

  async sleep({ time }: { time: number }) {
    return await this.driver.sleep(time);
  }

  async dataExtraction({ container, properties, saveOn }: { container: string, properties: DataExtractionProperty[], saveOn?: string }) {
    let data = [];

    const containerElements = await this._findElements(container);
    for (const containerElement of containerElements) {
      const rowData = {};
      for (const property of properties) {
        try {
          rowData[property.name] = await containerElement.findElement(By.css(property.selector)).getText() || null;
        } catch (error) {
          throw new Error(`Error on data extraction (${JSON.stringify({ property })}): ${error.message}`);
        }
      }
      data.push(rowData);
    }

    // Save data on browser memory
    if (saveOn) {
      this.saveMemory({ key: saveOn, value: data });
    }

    return data;
  }

  async saveMemory({ key, value }: { key: string, value: any }) {
    this.memory[key] = this.memory[key] ? this.memory[key].concat(value) : value;
  }

  async saveOnFile({ fileName, memoryKey }: { fileName: string, memoryKey: string }) {
    const data = this.memory[memoryKey];
    if (!data) throw new Error(`Memory key not found: ${memoryKey}`);
    fs.writeFileSync('tmp/' + fileName + '.json', JSON.stringify(data, null, 2));
  }

  async loop({ times, steps }: { times: number, steps: { method: string, params: { [key: string]: any } }[] }): Promise<void> {
    for (let i = 0; i < times; i++) {
      for (const step of steps) {
        await this[step.method](step.params);
      }
    }
  }

  private async _findElement(selector: string): Promise<WebElement> {
    return this.driver.findElement(By.css(selector));
  }

  private async _findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.css(selector));
  }



}
