import { IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import { ProxyPlugin } from 'selenium-chrome-proxy-plugin';
import { Browser, Builder, By, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export class WebBrowser {
  driver: WebDriver;

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
      console.log(`Waiting for page load: ${url}`);
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
    await this.waitPageLoad();
    const element = await this._findElement(selector);
    await element.click();
    if (sleep) await this.driver.sleep(sleep);
  }

  async inputText({ selector, content }: { selector: string, content: string; }) {
    await this.waitPageLoad();
    const element = await this._findElement(selector);
    return element.sendKeys(content);
  }

  async sleep({ time }: { time: number; }) {
    return await this.driver.sleep(time);
  }

  private async waitPageLoad() {
    await this.driver.wait(async () => {
      const readyState = await this.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 10000);
  }

  private async _findElement(selector: string) {
    return this.driver.wait(
      until.elementLocated(By.css(selector)),
      10000
    );
  }

}
