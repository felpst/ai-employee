import { By, Key, until } from "selenium-webdriver";
import { WebBrowser } from "../../web-browser/web-browser";

export class SearchUseCase {

  constructor(private webBrowser: WebBrowser) { }

  async execute(query: string) {
    console.log('Searching...');
    const searchInput = await this.driver.findElement(By.xpath("//input[@placeholder='Search']"));
    searchInput.clear()
    await searchInput.sendKeys(query, Key.RETURN);
    await this.driver.wait(until.urlContains('linkedin.com/search/results'), this.webBrowser.timeoutMS);
    const currentUrl = await this.driver.getCurrentUrl();
    if (!currentUrl.includes('linkedin.com/search/results')) throw new Error('Error on search');
  }

  get driver() {
    return this.webBrowser.driver;
  }
}
