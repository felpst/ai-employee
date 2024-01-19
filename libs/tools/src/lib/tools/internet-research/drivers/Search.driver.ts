import * as chromedriver from 'chromedriver';
import { Browser, Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export type BrowserType = 'chrome' | 'brightdata';

export class InternetResearchDriver {
  driver: WebDriver
  timeoutMS = 60000;
  isAuthenticaded = false;

  async start(browser: BrowserType) {
    await this[browser]();
  }

  async chrome() {
    try {
      console.log('Starting chrome driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      const chromeOptions = new Options();
      chromeOptions.addArguments('--headless');
      // chromeOptions.addArguments('--headless');
      chromeOptions.addArguments('--window-size=1366,768');
      chromeOptions.addArguments('--disable-gpu');
      chromeOptions.addArguments('--no-sandbox');
      // chromeOptions.addArguments('--no-proxy-server');

      //https://brd-customer-hl_6ba6b478-zone-scraping_browser-country-us:yyw4lf2yvlyo@brd.superproxy.io:9515
      // brd-customer-hl_6ba6b478-zone-isp eov6rhd8t0cr
      // chromeOptions.addArguments('--proxy-server=https://brd-customer-hl_6ba6b478-zone-isp:eov6rhd8t0cr@brd.superproxy.io:22225')

      // chromeOptions.addArguments('--disable-dev-shm-usage');
      // chromeOptions.addArguments('--disable-extensions');
      // chromeOptions.addArguments('--disable-infobars');
      // chromeOptions.addArguments('--ignore-certificate-errors');
      // chromeOptions.addArguments('--disable-features=WebRtcHideLocalIpsWithMdns');
      // chromeOptions.addArguments('--use-fake-ui-for-media-stream');
      // chromeOptions.addArguments('--use-fake-device-for-media-stream');


      const prefs = {
        'profile.default_content_setting_values.media_stream_camera': 1,
        'profile.default_content_setting_values.media_stream_mic': 1,
        'profile.default_content_setting_values.notifications': 1,
        'profile.default_content_setting_values.geolocation': 0,
      };
      chromeOptions.setUserPreferences(prefs);

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
