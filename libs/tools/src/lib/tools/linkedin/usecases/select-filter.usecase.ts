import { By } from "selenium-webdriver";
import { LinkedInDriver } from "../drivers/linkedin.driver";

export class SelectFilterUseCase {

  constructor(
    private linkedinDriver: LinkedInDriver
  ) {
    this._validation();
  }

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
    return this.linkedinDriver.driver;
  }

  _validation() {
    if (!this.linkedinDriver.isAuthenticaded)
      throw new Error('LinkedIn is not authenticated');
  }
}
