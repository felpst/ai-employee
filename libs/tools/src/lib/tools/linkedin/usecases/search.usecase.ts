import { By, Key, until } from "selenium-webdriver";
import { LinkedInDriver } from "../drivers/linkedin.driver";

export class SearchUseCase {

  constructor(private linkedinDriver: LinkedInDriver) {
    this._validation();
  }

  async execute(query: string) {
    console.log('Searching...');
    const searchInput = await this.driver.findElement(By.xpath("//input[@placeholder='Search']"));
    searchInput.clear()
    await searchInput.sendKeys(query, Key.RETURN);
    await this.driver.wait(until.urlContains('linkedin.com/search/results'), this.linkedinDriver.timeoutMS);
    const currentUrl = await this.driver.getCurrentUrl();
    if (!currentUrl.includes('linkedin.com/search/results')) throw new Error('Error on search');
  }

  get driver() {
    return this.linkedinDriver.driver;
  }

  _validation() {
    if (!this.linkedinDriver.isAuthenticaded) throw new Error('LinkedIn is not authenticated');
  }
}
