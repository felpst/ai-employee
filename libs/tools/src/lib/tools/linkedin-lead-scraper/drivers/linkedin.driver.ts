import * as chromedriver from 'chromedriver';
import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { ILead } from '../linkedin-lead-scraper.interfaces';
import { extractLeadsFromContent } from '../utils/extract-leads.util';

export class LinkedInWebDriver {
  driver: WebDriver

  async startDriver() {
    chromedriver.path; // Force chromedriver to be downloaded

    const chromeOptions = new Options();
    // chromeOptions.windowSize({ width: 1366, height: 768 });
    chromeOptions.addArguments('--headless=new').windowSize({ width: 1366, height: 768 });
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-extensions');
    chromeOptions.addArguments('--disable-infobars');
    chromeOptions.addArguments('--ignore-certificate-errors');
    chromeOptions.addArguments('--disable-features=WebRtcHideLocalIpsWithMdns');
    chromeOptions.addArguments('--use-fake-ui-for-media-stream');
    chromeOptions.addArguments('--use-fake-device-for-media-stream');
    chromeOptions.addArguments();

    const prefs = {
      'profile.default_content_setting_values.media_stream_camera': 1,
      'profile.default_content_setting_values.media_stream_mic': 1,
      'profile.default_content_setting_values.notifications': 1,
      'profile.default_content_setting_values.geolocation': 1,
    };
    chromeOptions.setUserPreferences(prefs);

    this.driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  }

  async login(auth: { user: string, password: string }) {
    console.log('Logging in...');

    try {
      if (!this.driver) await this.startDriver();

      await this.driver.get('https://www.linkedin.com/login');

      // Set user
      const userInput = await this.driver.wait(until.elementLocated(By.id('username')), 5000);
      await userInput.sendKeys(auth.user);

      // Set password
      const passwordInput = await this.driver.findElement(By.id('password'));
      await passwordInput.sendKeys(auth.password, Key.RETURN);

      // TODO: Resolve security check case
      // url: https://www.linkedin.com/checkpoint/challenge/verify

      await this.driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 100000);
      console.log('Logged..');
    } catch (error) {
      console.error(error.message)
      throw new Error('Error on login');
    }
  }

  async search(query: string) {
    console.log('Searching...');
    const searchInput = await this.driver.findElement(By.xpath("//input[@placeholder='Search']"));
    searchInput.clear()
    await searchInput.sendKeys(query, Key.RETURN);
    await this.driver.wait(until.urlContains('linkedin.com/search/results'), 50000);
  }

  async extractLeads(query: string, quantity: number = 10): Promise<ILead[]> {
    console.log('Extracting leads...');
    await this.search(query);
    await this._clickPeopleFilterButton();
    return await this._extractLeads(quantity);
  }

  private async _clickPeopleFilterButton() {
    console.log('Clicking people filter button...');
    const findButtons = await this.driver.findElements(By.className('search-reusables__filter-pill-button'));

    findButtons.forEach(async (button) => {
      const buttonName = await button.getText();
      if (buttonName === 'People') {
        button.click();
      }
    })
    console.log('Clicked people filter button...');
    await this.driver.sleep(5000);
  }

  private async _extractLeads(quantity = 10): Promise<ILead[]> {
    const leads: ILead[] = [];

    while (leads.length < quantity) {
      try {
        console.log('Extracting leads...');
        let nextButton = null

        await this.driver.wait(
          until.elementsLocated(By.className('entity-result__content')),
          20000,
          'Elements not found within the time limit.'
        );

        // Extract leads on page
        console.log('Extracting leads on page...');
        const content = await this.driver.findElements(By.className('entity-result__content'));
        const pageLeads = await extractLeadsFromContent(content);
        leads.push(...pageLeads);

        if (leads.length >= quantity) break;

        // Wait
        await this.driver.sleep(5000);

        // Next Page
        console.log('Next page button...');
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        nextButton = await this.driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Next')]")), 10000);
        nextButton = await this.driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await this.driver.wait(until.elementIsEnabled(nextButton), 5000);
        await nextButton.click();

        // Wait
        await this.driver.wait(
          until.stalenessOf(content[content.length - 1]),
          20000,
          'Elements not found within the time limit.'
        );
      } catch (error) {
        console.error('LinkedIn Driver _extractLeads(): ' + error.message)
        break;
      }
    }

    return leads;
  }

  async close() {
    await this.driver.quit();
  }

}
