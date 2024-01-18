import { IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import { ProxyPlugin } from 'selenium-chrome-proxy-plugin';
import { Browser, Builder, By, WebDriver, WebElement, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { DataExtractionProperty } from '../browser.interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class WebBrowser {
  driver: WebDriver
  memory: any = {};

  async open(options: IWebBrowserOptions = {}) {
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      // Profile
      const tmpPath = process.env.PROD === 'true' ? '/tmp' : os.tmpdir();
      const profileDirectory = `${path.join(tmpPath, 'browser', 'users', options.aiEmployeeId || 'default')}`
      if (options.aiEmployeeId) {
        fs.mkdirSync(profileDirectory, { recursive: true });
      }

      let chromeOptions = new Options();
      if (options.headless) chromeOptions.addArguments('--headless=new');
      chromeOptions.addArguments('--window-size=1366,768');
      console.log(profileDirectory);

      chromeOptions.addArguments('--user-data-dir=' + profileDirectory);

      const prefs = {
        'profile.default_content_setting_values.media_stream_camera': 1,
        'profile.default_content_setting_values.media_stream_mic': 1,
        'profile.default_content_setting_values.notifications': 1,
        'profile.default_content_setting_values.geolocation': 0,
      };
      chromeOptions.setUserPreferences(prefs);

      // Proxy options
      if (options.proxy) {
        const proxyConfig = {
          host: 'brd.superproxy.io',
          port: '22225',
          username: 'brd-customer-hl_6ba6b478-zone-isp',
          password: 'eov6rhd8t0cr',
          tempDir: '/tmp'
        };

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
    element.sendKeys(content);
  }

  async sleep({ time }: { time: number }) {
    await this.driver.sleep(time);
  }

  async dataExtraction({ container, properties, saveOn }: { container: string, properties: DataExtractionProperty[], saveOn?: string }) {
    let data = [];

    const containerElements = await this._findElements(container);
    console.log('containerElements', containerElements.length);

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

    console.log(JSON.stringify(data));

    // Save data on browser memory
    if (saveOn) {
      this.saveMemory({ key: saveOn, value: data });
    }

    return `Data extraction completed: ${data.length} rows.`;
  }

  async untilElementIsVisible({ selector }: { selector: string }) {
    const element = await this._findElement(selector);
    await this.driver.wait(async () => {
      return await element.isDisplayed();
    }, 10000);
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
    let response: any;
    for (let i = 0; i < times; i++) {
      response = await this.runSteps(steps);
    }
    return response;
  }

  async if ({ condition, steps }: { condition: string, steps: { method: string, params: { [key: string]: any } }[] }): Promise<void> {
    await this.sleep({ time: 5000 })

    await this.updateMemory();
    let response: any;
    // console.log('memory', JSON.stringify(this.memory));

    // Evaluate condition
    const func = `const browserMemory = JSON.parse('${JSON.stringify(this.memory)}'); ${condition};`;
    // console.log('func', func);
    const isValid = eval(func);
    // console.log('isValid', isValid);

    if (isValid) {
      response = await this.runSteps(steps);
    }
    return response;
  }

  async runSteps(steps: { method: string, params: { [key: string]: any } }[], inputs: any = this.memory.inputs || {}) {
    let response: any;

    // Set memory
    this.memory.inputs = inputs;

    // Evaluate inputs
    for (const step of steps) {
      for (const key of Object.keys(step.params)) {
        const value = step.params[key];
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
          const inputKey = value.substring(1, value.length - 1);
          step.params[key] = inputs[inputKey];
        }
      }
    }
    console.log(JSON.stringify(steps));

    for (const step of steps) {
      const { method, params } = step;
      console.log('instruction', JSON.stringify(step));
      response = await this[method](params) || response;
    }

    return response;
  }

  private async _findElement(selector: string): Promise<WebElement> {
    try {
      return await this.driver.wait(until.elementLocated(By.css(selector)), 10000);
    } catch (error) {
      throw new Error(`Element not found: ${selector}`);
    }
  }

  private async _findElements(selector: string): Promise<WebElement[]> {
    try {
      return await this.driver.wait(until.elementsLocated(By.css(selector)), 10000);
    } catch (error) {
      throw new Error(`Elements not found: ${selector}`);
    }
  }

  private async updateMemory() {
    this.memory['currentUrl'] = await this.driver.getCurrentUrl();
  }


}
