import { IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import { ProxyPlugin } from 'selenium-chrome-proxy-plugin';
import { Browser, Builder, By, WebDriver, WebElement, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { BrowserActions, DataExtractionProperty, SkillStep } from '../browser.interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Key } from './press-key.interface';

export class WebBrowser implements BrowserActions {
  driver: WebDriver;
  memory: any = {};

  async open(options: IWebBrowserOptions = {}) {
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      // Profile
      const tmpPath = process.env.PROD === 'true' ? '/tmp' : os.tmpdir();
      const profileDirectory = `${path.join(tmpPath, 'browser', 'users', options.aiEmployeeId || 'default')}`;
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
        });
      }

      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .build();
      console.log('Driver started...');
    } catch (error) {
      console.error(error);
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

  async click({ selector, sleep }: { selector: string, sleep?: number; }) {
    const element = await this._findElement(selector);
    await element.click();
    if (sleep) await this.driver.sleep(sleep);
  }

  async clickByText({ text, tagName, sleep }: { text: string, tagName: string, sleep?: number; }) {
    await this.driver.sleep(sleep);
    const element = await this._findElementByText(text, tagName);
    await element.click();
    if (sleep) await this.driver.sleep(sleep);
  }

  async selectOption({ selector, value }: { selector: string, value: string; }) {
    const element = await this._findElement(selector);
    await element.findElement(By.css(`option[value="${value}"]`)).click();
  }

  async doubleClick({ selector }: { selector: string; }) {
    const element = await this._findElement(selector);
    await this.driver.actions().doubleClick(element).perform();
  }

  async inputText({ selector, content }: { selector: string, content: string; }) {
    const element = await this._findElement(selector);
    element.sendKeys(content);
  }

  async sleep({ time }: { time: number; }) {
    await this.driver.sleep(time);
  }

  async switchToFrame({ selector }: { selector: string; }) {
    const element = await this._findElement(selector);
    await this.driver.switchTo().frame(element);
  }

  async switchToDefaultContent() {
    await this.driver.switchTo().defaultContent();
  }

  async scroll({ pixels }: { pixels: number; }) {
    try {
      await this.driver.executeScript(`window.scrollBy(0, ${pixels});`);
    } catch (error) {
      throw new Error('Scroll is not posible');
    }
  };

  async dataExtraction({ container, properties, saveOn }: { container: string, properties: DataExtractionProperty[], saveOn?: string; }) {
    await this.sleep({ time: 5000 });

    let data = [];

    const containerElements = await this._findElements(container);
    for (const containerElement of containerElements) {
      const rowData = {};
      for (const property of properties) {

        if (property.attribute) {
          //TODO: GET ATRIBUTES IS NOT WORK
          rowData[property.name] = await containerElement.getAttribute(property.attribute) || null;
        } else if (property.selector) {
          if (!property.type) property.type = 'string';
          try {
            // TODO - Check if element is displayed
            const element = containerElement.findElement(By.css(property.selector));

            switch (property.type) {
              case 'boolean':
                rowData[property.name] = await element?.isDisplayed() || false;
                break;
              default:
                rowData[property.name] = await element.getText() || null;
                break;
            }
          } catch (error) {
            rowData[property.name] = null;
          }
        }
      }

      console.log('rowData', JSON.stringify(rowData));

      let isValid = false;
      // Check if have at least one value
      for (const value of Object.values(rowData)) {
        if (value) { isValid = true; break; }
      }
      // Check if all required values are present
      for (const property of properties) {
        const value = rowData[property.name];
        if (property.required && !value) { isValid = false; break; }
      }
      console.log('rowDataisValid', isValid, JSON.stringify(rowData));

      if (isValid) data.push(rowData);
    }

    console.log(JSON.stringify(data));

    // Save data on browser memory
    if (saveOn) {
      this.saveMemory({ key: saveOn, value: data });
    }

    const response = `Data extraction completed: ${data.length} rows. ${saveOn ? `Saved on memory: ${saveOn}` : ''}. First ${data.length > 20 ? 20 : data.length} results: \`\`\`json\n${JSON.stringify(data.slice(0, 20))}\n\`\`\``;
    return response;
  }

  async untilElementIsVisible({ selector }: { selector: string; }) {
    const element = await this._findElement(selector);
    await this.driver.wait(async () => {
      return await element.isDisplayed();
    }, 10000);
  }

  async saveMemory({ key, value }: { key: string, value: any; }) {
    this.memory[key] = this.memory[key] ? this.memory[key].concat(value) : value;
  }

  async saveOnFile({ fileName, memoryKey }: { fileName: string, memoryKey: string; }) {
    const data = this.memory[memoryKey];
    if (!data) throw new Error(`Memory key not found: ${memoryKey}`);
    fs.writeFileSync('tmp/' + fileName + '.json', JSON.stringify(data, null, 2));
  }

  async loop({ times, steps }: { times: number, steps: SkillStep[]; }): Promise<void> {
    let response: any;
    for (let i = 0; i < times; i++) {
      response = await this.runSteps(steps);
    }
    return response;
  }

  async if({ condition, steps }: { condition: string, steps: SkillStep[]; }): Promise<void> {
    await this.sleep({ time: 5000 });

    await this.updateMemory();
    let response: any;

    // Evaluate condition
    const func = `const browserMemory = JSON.parse('${JSON.stringify(this.memory)}'); ${condition};`;
    const isValid = eval(func);

    if (isValid) {
      response = await this.runSteps(steps);
    }
    return response;
  }

  async runSteps(steps: SkillStep[], inputs: any = this.memory.inputs || {}) {
    let response: any;

    // Set memory
    this.memory.inputs = inputs;

    for (const step of steps) {
      const { method, params } = step;

      // Parse params
      if (!params) continue;
      for (const param of Object.keys(params)) {
        if (!params[param] || typeof params[param] !== 'string') continue;
        params[param] = params[param].replace(/{(.*?)}/g, (match, inputKey) => inputs[inputKey]);
      }

      console.log('instruction', JSON.stringify(step));
      response = await this[method](params as any) || response;

      if (step.successMessage) response = await this.parseResponse(step.successMessage, inputs) || response;
    }

    return response;
  }

  async pressKey({ key }: { key: string; }): Promise<string> {
    await this.sleep({ time: 1000 });

    key = Key[key];
    return await this.driver.actions().keyDown(key).perform().then(
      async () => {
        await this.driver.actions().keyUp(key).perform();
        await this.sleep({ time: 10000 });
        return `Key ${key} pressed`;
      },
      (error) => {
        return error.message;
      }
    );

  };

  async parseResponse(response: string, memory: any = this.memory) {
    console.log('parseResponse', response);

    if (!response || typeof response !== 'string') return;
    return response.replace(/{(.*?)}/g, (match, inputKey) => {
      const value = memory[inputKey];
      if (Array.isArray(value)) return `\`\`\`json\n${JSON.stringify(value.slice(0, 20))}\n\`\`\``;;
      if (typeof value === 'object') return `\`\`\`json\n${JSON.stringify(value)}\n\`\`\``;
      return value;
    });
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

  private async _findElementByText(text: string, tagName: string = '*'): Promise<WebElement> {
    try {
      const path = `//${tagName}[text() = '${text}']`;
      const el = await this.driver.findElement(By.xpath(path));
      return el;
    } catch (error) {
      throw new Error(`Element not found with this text: ${text}`);
    }
  }
}
