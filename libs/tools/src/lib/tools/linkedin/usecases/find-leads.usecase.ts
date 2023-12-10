import { By, WebElement, until } from "selenium-webdriver";
import { LinkedInDriver } from "../drivers/linkedin.driver";
import { SearchUseCase } from "./search.usecase";
import { SelectFilterUseCase } from "./select-filter.usecase";

export interface ILinkedInFindLeadsRequest {
  query: string;
  quantity?: number;
}

export interface ILinkedInLead {
  name: string;
  title: string;
  location: string;
  profileLink?: string;
}

export class FindLeadsUseCase {

  constructor(private linkedinDriver: LinkedInDriver) {
    this._validation();
  }

  async execute(settings: ILinkedInFindLeadsRequest): Promise<ILinkedInLead[]> {
    const leads: ILinkedInLead[] = [];
    const { query, quantity = 5 } = settings;

    await new SearchUseCase(this.linkedinDriver).execute(query);
    await new SelectFilterUseCase(this.linkedinDriver).execute('People');

    while (leads.length < quantity) {
      try {
        console.log('Extracting leads...');

        await this._loadLeadsPage();
        const content = await this.driver.findElements(By.className('entity-result__content'));
        const leadsFromPage = await this._extractLeadsFromPage(content);
        if (leadsFromPage.length) {
          leads.push(...leadsFromPage);
        }

        if (leads.length >= quantity) break;

        // Wait
        await this.driver.sleep(5000);

        // Next Page
        console.log('Next page button...');
        await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        let nextButton = await this.driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Next')]")), 10000);
        if (!nextButton) { break; }
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

  private async _loadLeadsPage() {
    await this.driver.wait(
      until.elementsLocated(By.className('entity-result__content')),
      20000,
      'Elements not found within the time limit.'
    );
  }

  private async _extractLeadsFromPage(content: WebElement[]) {
    console.log('Extracting leads from page...');
    const leads = [];
    for (const el of content) {
      try {
        const nameLinkElement = await el.findElement(By.className('app-aware-link'))
        const name = (await nameLinkElement.getText()).split('\n')[0];
        const title = await el.findElement(By.className('entity-result__primary-subtitle')).getText();
        const location = await el.findElement(By.className('entity-result__secondary-subtitle')).getText();
        const profileLink = await nameLinkElement.getAttribute('href');
        const lead: ILinkedInLead = { name, title, location, profileLink };
        leads.push(lead)
      } catch (error) { /* empty */ }
    }
    return leads;
  }

  get driver() {
    return this.linkedinDriver.driver;
  }

  private _validation() {
    if (!this.linkedinDriver.isAuthenticaded) throw new Error('LinkedIn is not authenticated');
  }
}
