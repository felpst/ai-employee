import { IWebBrowser, IWebBrowserOptions } from '@cognum/interfaces';
import * as chromedriver from 'chromedriver';
import ProxyPlugin from 'selenium-chrome-proxy-plugin';
import { Browser, Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export class WebBrowser implements IWebBrowser {
  options: IWebBrowserOptions = { proxy: false, browser: 'chrome', headless: true }
  driver: WebDriver
  timeoutMS = 60000;

  async start(options: IWebBrowserOptions = {}) {
    this.options = { ...this.options, ...options };
    await this[this.options.browser]();
    return this;
  }

  async chrome() {
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      let chromeOptions = new Options();
      if (this.options.headless) chromeOptions.addArguments('--headless=new');
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
      if (this.options.proxy) {
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

  async brightdata() {
    try {
      console.log('Starting driver...');
      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .usingServer(process.env.SBR_WEBDRIVER)
        .build();
      console.log('Driver started...');
    } catch (error) {
      console.error(error)
      throw new Error(error.message);
    }
  }

  async close() {
    console.log('Closing driver...');
    await this.driver.quit();
  }

}
