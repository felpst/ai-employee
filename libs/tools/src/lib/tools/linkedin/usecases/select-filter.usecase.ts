import { By } from "selenium-webdriver";
import { WebBrowser } from "../../web-browser/web-browser";

export class SelectFilterUseCase {

  constructor(
    private webBrowser: WebBrowser
  ) { }

  async execute(filterButton: 'Jobs' | 'People' | 'Services' | 'Posts' | 'Groups' | 'Companies') {
    console.log(`Clicking "${filterButton}" filter button...`);
    const findButtons = await this.driver.findElements(By.className('search-reusables__filter-pill-button'));

    findButtons.forEach(async (button) => {
      const buttonName = await button.getText();
      if (buttonName === filterButton) {
        button.click();
      }
    })

    console.log(`Clicked "${filterButton}" filter button...`);
    await this.driver.sleep(5000);
  }

  get driver() {
    return this.webBrowser.driver;
  }

}
