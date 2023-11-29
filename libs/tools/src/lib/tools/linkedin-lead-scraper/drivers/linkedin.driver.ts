import * as chromedriver from 'chromedriver';
import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { ILead } from '../linkedin-lead-scraper.interfaces';
import { extractLeadsFromContent } from '../utils/extract-leads.util';

export class LinkedInWebDriver {
  driver: WebDriver

  async startDriver() {
    console.log(chromedriver.path);
    chromedriver.path;

    const chromeOptions = new Options();
    chromeOptions.windowSize({ width: 1366, height: 768 });
    // chromeOptions.addArguments('--headless=new').windowSize({ width: 1366, height: 768 });
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
    } catch (error) {
      throw new Error('Error on login');
    }
  }

  async search(query: string) {
    const searchInput = await this.driver.findElement(By.xpath("//input[@placeholder='Search']"));
    searchInput.clear()
    await searchInput.sendKeys(query, Key.RETURN);
    await this.driver.wait(until.urlContains('linkedin.com/search/results'), 50000);
  }

  async extractLeads(query: string, quantity: number = 10): Promise<ILead[]> {
    await this.search(query);
    await this._clickPeopleFilterButton();
    return await this._extractLeads(quantity);
  }

  private async _clickPeopleFilterButton() {
    const findButtons = await this.driver.findElements(By.className('search-reusables__filter-pill-button'));

    findButtons.forEach(async (button) => {
      const buttonName = await button.getText();
      if (buttonName === 'People') {
        button.click();
      }
    })

    const div = await this.driver.wait(until.elementLocated(By.xpath('//h2/div')), 1500000);
    await this.driver.wait(until.elementTextContains(div, 'About'), 1500000);
    await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await this.driver.wait(until.elementLocated(By.className('artdeco-pagination')), 1500000);
    await this.driver.wait(until.elementLocated(By.className('artdeco-pagination__button')), 1500000);
  }

  private async _extractLeads(quantity = 10): Promise<ILead[]> {
    const leads: ILead[] = [];

    while (leads.length < quantity) {
      try {
        let nextButton = null

        await this.driver.wait(
          until.elementsLocated(By.className('entity-result__content')),
          20000,
          'Elements not found within the time limit.'
        );

        // Extract leads on page
        const content = await this.driver.findElements(By.className('entity-result__content'));
        const pageLeads = await extractLeadsFromContent(content);
        leads.push(...pageLeads);

        // Wait
        this.driver.sleep(5000);

        // Next Page
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        nextButton = await this.driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Next')]")), 10000);
        nextButton = await this.driver.findElement(By.xpath("//button[contains(., 'Next')]"));
        await this.driver.wait(until.elementIsEnabled(nextButton), 5000);
        await nextButton.click();

        await this.driver.wait(
          until.stalenessOf(content[content.length - 1]),
          20000,
          'Elements not found within the time limit.'
        );
      } catch (error) {
        break;
      }
    }

    return leads;
  }

  async close() {
    await this.driver.quit();
  }

}
