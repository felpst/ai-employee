import { IAIEmployee, IAIEmployeeCall, IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import { ProxyPlugin } from 'selenium-chrome-proxy-plugin';
import {
  Browser,
  Builder,
  By,
  WebDriver,
  WebElement,
  until,
} from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import {
  BrowserActions,
  DataExtractionProperty,
  SkillStep,
} from '../browser.interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Key } from './press-key.interface';

import { AIEmployee } from '@cognum/ai-employee';
import BrowserPage from './browser-page';

export class WebBrowser implements BrowserActions {
  driver: WebDriver;
  memory: any = {};

  aiEmployeeId: string;

  page: BrowserPage;

  constructor() {
    this.page = new BrowserPage(this);
  }

  async open(options: IWebBrowserOptions = {}) {
    this.aiEmployeeId = options.aiEmployeeId;
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      // Profile
      const tmpPath = process.env.PROD === 'true' ? '/tmp' : os.tmpdir();
      const profileDirectory = `${path.join(
        tmpPath,
        'browser',
        'users',
        options.aiEmployeeId || 'default'
      )}`;
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
          tempDir: '/tmp',
        };

        chromeOptions = await new ProxyPlugin({
          proxyConfig,
          chromeOptions,
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

  async loadUrl({ url }: { url: string; }): Promise<string> {
    await this.driver.get(url).then(async () =>
        await this.driver.wait(async () => {
            const readyState = await this.driver.executeScript('return document.readyState');
            return readyState === 'complete';
          }, 10000)
          .then()
          .catch()
    );

    return this.getCurrentUrl();
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async click({
    selector,
    sleep,
    ignoreNotExists = false,
  }: {
    selector: string;
    sleep?: number;
    ignoreNotExists?: boolean;
  }) {
    try {
      const element = await this._findElement(selector);
      await element.click();
      if (sleep) await this.driver.sleep(sleep);
    } catch (error) {
      if (!ignoreNotExists || !error.message.includes('Element not found'))
        throw error;
    } finally {
      return true;
    }
  }

  async clickByText({
    text,
    tagName,
    sleep,
    ignoreNotExists = false,
  }: {
    text: string;
    tagName: string;
    sleep?: number;
    ignoreNotExists?: boolean;
  }) {
    try {
      await this.driver.sleep(sleep);
      const element = await this._findElementByText(text, tagName);
      await element.click();
      if (sleep) await this.driver.sleep(sleep);
    } catch (error) {
      if (
        !ignoreNotExists ||
        !error.message.includes('Element not found with this text')
      )
        throw error;
    }
  }

  async clickByCoordinates({
    x,
    y,
    sleep,
  }: {
    x: number;
    y: number;
    sleep?: number;
  }) {
    await this.driver.actions().move({ x, y }).click().perform();
    if (sleep) await this.driver.sleep(sleep);
  }

  async selectOption({ selector, value }: { selector: string; value: string }) {
    const element = await this._findElement(selector);
    await element.findElement(By.css(`option[value="${value}"]`)).click();
  }

  async doubleClick({ selector }: { selector: string; }) {
    const element = await this._findElement(selector);
    await this.driver.actions().doubleClick(element).perform();
  }

  async inputText({
    selector,
    content,
  }: {
    selector: string;
    content: string;
  }) {
    // Removing characters outside the BMP table (😊🌞)
    const _content = content.replace(/[\uD800-\uDFFF]./g, '').replace(/\s{2,}/g, ' ');
    const element = await this._findElement(selector);
    await element.sendKeys(_content);
    return true;
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
      return true;
    } catch (error) {
      throw new Error('Scroll is not posible');
    }
  }

  async elementScroll({
    direction,
    pixels,
    selector,
    useCurrentScroll = false,
  }: {
    direction: 'vertical' | 'horizontal';
    pixels: number;
    selector: string;
    useCurrentScroll: boolean;
  }) {
    try {
      const element = await this._findElement(selector);
      let position = 0;
      if (useCurrentScroll) {
        const scriptStr =
          direction === 'horizontal'
            ? 'return arguments[0].scrollLeft;'
            : 'return arguments[0].scrollTop;';
        position = parseInt(
          await this.driver.executeScript(scriptStr, element)
        );
      }
      const script =
        direction === 'horizontal'
          ? `arguments[0].scrollLeft = ${position + pixels};`
          : `arguments[0].scrollTop = ${position + pixels};`;

      await this.driver.executeScript(script, element);
    } catch (error) {
      throw new Error('Scroll is not posible');
    }
  }

  async dataExtraction({container,properties,saveOn,
  }: {
    container: string;
    properties: DataExtractionProperty[];
    saveOn?: string;
  }) {
    await this.sleep({ time: 5000 });

    let data = [];

    const containerEl = await this._findElement(container);
    const containerChildren = await containerEl.findElements(By.xpath('./*'));
    console.log('containerChildren', containerChildren);

    for (const containerElement of containerChildren) {
      const rowData = {};
      for (const property of properties) {
        if (!property.selector && property.attribute) {
          //TODO: GET ATRIBUTES IS NOT WORK
          rowData[property.name] = (await containerElement.getAttribute(property.attribute)) || null;
        } else if (property.selector) {

          if (!property.type) property.type = 'string';

          try {
            let elements: WebElement[];
            try {
              elements = await containerElement.findElements(
                By.css(property.selector)
              );
            } catch (_) { }

            const element = elements && elements.length > 0 ? elements[0] : null;

            if (property.innerAttribute) {
              const attributeValue = await element.getAttribute(property.innerAttribute);
              rowData[property.name] = attributeValue || null;
            } else {
              switch (property.type) {
                case 'boolean':
                  rowData[property.name] =
                    (await elements[0].isDisplayed()) || false;
                  break;
                case 'array':
                  const name = property.name;
                  rowData[name] = await Promise.all(elements.map(async (element) => {
                        return await element.getText();
                      })) || [];
                  break;

                default:
                  if (property.selector && property.attribute) {
                    if (elements.length > 1) {
                      console.log(elements.length, 'elements');
                      rowData[property.name] = await Promise.all(elements.map(async (element) => {
                            return await element.getAttribute(property.attribute);
                          })) || [];
                    } else {
                      rowData[property.name] =
                        (await elements[0].getAttribute(property.attribute)) ||
                        null;
                    }
                  } else {
                    rowData[property.name] = (await elements[0].getText()) || null;
                  }
                  break;
              }

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
        if (value) {
          isValid = true;
          break;
        }
      }
      // Check if all required values are present
      for (const property of properties) {
        const value = rowData[property.name];
        if (property.required && !value) {
          isValid = false;
          break;
        }
      }
      console.log('rowDataisValid', isValid, JSON.stringify(rowData));

      if (isValid) data.push(rowData);
    }

    console.log(data);

    // Save data on browser memory
    if (saveOn) {
      this.saveMemory({ key: saveOn, value: data });
    }

    return `Data extraction completed: ${data.length} rows. ${saveOn ? `Saved on memory key: "${saveOn}".` : ''
    }\nFirst ${data.length > 5 ? 5 : data.length} results: \n\`\`\`json\n${JSON.stringify(data.slice(0, 5), null, 2)}\n\`\`\``;
  }

  async untilElementIsVisible({ selector }: { selector: string; }) {
    const element = await this._findElement(selector);
    await this.driver.wait(async () => {
      return await element.isDisplayed();
    }, 10000);
  }

  async saveMemory({ key, value }: { key: string; value: any; }) {
    this.memory[key] = this.memory[key]
      ? this.memory[key].concat(value)
      : value;
  }

  async saveOnFile({
    fileName,
    memoryKey,
  }: {
    fileName: string;
    memoryKey: string;
  }) {
    const data = this.memory[memoryKey];
    if (!data) throw new Error(`Memory key not found: ${memoryKey}`);
    fs.writeFileSync(
      'tmp/' + fileName + '.json',
      JSON.stringify(data, null, 2)
    );
  }

  async loop({
    times,
    steps,
  }: {
    times: number;
    steps: SkillStep[];
  }): Promise<void> {
    let response: any;
    for (let i = 0; i < times; i++) {
      response = await this.runSteps(steps);
    }
    return response;
  }

  async if({
    condition,
    steps,
  }: {
    condition: string;
    steps: SkillStep[];
  }): Promise<void> {
    await this.sleep({ time: 5000 });

    await this.updateMemory();
    let response: any;
    // Evaluate condition
    const func = `const browserMemory = JSON.parse('${JSON.stringify(
      this.memory
    )}'); ${condition};`;
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
        params[param] = params[param].replace(
          /{(.*?)}/g,
          (match, inputKey) => inputs[inputKey]
        );
      }

      console.log('instruction', JSON.stringify(step));
      response = (await this[method](params as any)) || response;

      if (step.successMessage)
        response =
          (await this.parseResponse(step.successMessage, inputs)) || response;
    }

    return response;
  }

  async pressKey({ key }: { key: string; }): Promise<boolean> {
    await this.sleep({ time: 1000 });

    key = Key[key];
    return this.driver
      .actions()
      .keyDown(key)
      .perform()
      .then(async () => {
        await this.driver.actions().keyUp(key).perform();
        await this.sleep({ time: 10000 });
        return true;
      });
  }

  async parseResponse(response: string, memory: any = this.memory) {
    console.log('parseResponse', response);

    if (!response || typeof response !== 'string') return;
    return response.replace(/{(.*?)}/g, (match, inputKey) => {
      const value = memory[inputKey];
      if (Array.isArray(value))
        return `\`\`\`json\n${JSON.stringify(value.slice(0, 20))}\n\`\`\``;
      if (typeof value === 'object')
        return `\`\`\`json\n${JSON.stringify(value)}\n\`\`\``;
      return value;
    });
  }

  protected async _findElement(selector: string): Promise<WebElement> {
    try {
      return this.driver.findElement(By.css(selector));
    } catch (error) {
      return this.driver
        .wait(until.elementLocated(By.css(selector)), 10000)
        .then(r => r)
        .catch((e) => {
          throw new Error(`Element not found: ${selector}`);
        });
    }
  }

  protected async _findElements(selector: string): Promise<WebElement[]> {
    try {
      return this.driver.findElements(By.css(selector));
    } catch (error) {
      return this.driver
        .wait(until.elementsLocated(By.css(selector)), 10000)
        .then(r => r)
        .catch((e) => {
          throw new Error(`Elements not found: ${selector}`);
        });
    }
  }

  protected async updateMemory() {
    this.memory['currentUrl'] = await this.driver.getCurrentUrl();
  }


  async replyMessages({messagesKey, inputSelector, buttonSelector} : {messagesKey: string, inputSelector: string, buttonSelector: string}) {

    const aiEmployee: IAIEmployee = await AIEmployee.findOne({ _id: this.aiEmployeeId });
    const lastMessage = this.memory[messagesKey].pop()

    const message = await aiEmployee.call({
      input: lastMessage.messageContent,
      user: {
        _id: aiEmployee._id,
        name: lastMessage.name,
        email: lastMessage.email
      },
      context: {
        chatChannel: 'chat',
        chatMessages: this.memory[messagesKey].map((message) => ({
          sender: `${message.name} - ${message.email}`,
          content: message.messageContent
        }))
      }
    })

    const callResult: IAIEmployeeCall = await new Promise((resolve, reject) => {
      try {
        message.run().subscribe(message => {
          if (message.status === 'done') { resolve(message); }
        })
      } catch (error) {
        reject(error);
      }
    });

    await this.inputText({ selector: inputSelector, content: callResult.output });

    await this.click({ selector: buttonSelector, ignoreNotExists: false });

  }



  private async _findElementByText(
    text: string,
    tagName: string = '*'
  ): Promise<WebElement> {
    try {
      const path = `//${tagName}[text() = '${text}']`;
      const el = await this.driver.findElement(By.xpath(path));
      return el;
    } catch (error) {
      throw new Error(`Element not found with this text: ${text}`);
    }
  }

}
