import * as chromedriver from 'chromedriver';
import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export class LinkedInDriver {
  driver: WebDriver
  timeoutMS = 60000;
  isAuthenticaded = false;

  async start() {
    try {
      console.log('Starting driver...');

      chromedriver.path; // Force chromedriver to be downloaded

      const chromeOptions = new Options();
      // chromeOptions.addArguments('--headless:new');
      chromeOptions.addArguments('--headless');
      chromeOptions.addArguments('--window-size=1366,768');
      chromeOptions.addArguments('--disable-gpu');
      chromeOptions.addArguments('--no-proxy-server');
      chromeOptions.addArguments('--no-sandbox');
      chromeOptions.addArguments('--disable-dev-shm-usage');
      chromeOptions.addArguments('--disable-extensions');
      chromeOptions.addArguments('--disable-infobars');
      chromeOptions.addArguments('--ignore-certificate-errors');
      chromeOptions.addArguments('--disable-features=WebRtcHideLocalIpsWithMdns');
      chromeOptions.addArguments('--use-fake-ui-for-media-stream');
      chromeOptions.addArguments('--use-fake-device-for-media-stream');

      const prefs = {
        'profile.default_content_setting_values.media_stream_camera': 1,
        'profile.default_content_setting_values.media_stream_mic': 1,
        'profile.default_content_setting_values.notifications': 1,
        'profile.default_content_setting_values.geolocation': 0,
      };
      chromeOptions.setUserPreferences(prefs);

      this.driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
      console.log('Driver started...', this.driver);
    } catch (error) {
      console.error(error.message)
      throw new Error(error.message);
    }
  }
  async close() {
    console.log('Closing driver...');
    await this.driver.quit();
  }

}
