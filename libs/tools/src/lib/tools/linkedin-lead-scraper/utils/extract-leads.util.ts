import { By, WebElement } from "selenium-webdriver";
import { ILead } from "../linkedin-lead-scraper.interfaces";

export async function extractLeadsFromContent(content: WebElement[]): Promise<ILead[]> {
  const leads = [];
  for (const el of content) {
    try {
      const nameLinkElement = await el.findElement(By.className('app-aware-link'))
      const name = (await nameLinkElement.getText()).split('\n')[0];
      const title = await el.findElement(By.className('entity-result__primary-subtitle')).getText();
      const location = await el.findElement(By.className('entity-result__secondary-subtitle')).getText();
      const profileLink = await nameLinkElement.getAttribute('href');
      const lead: ILead = { name, title, location, profileLink };
      leads.push(lead)
    } catch (error) { /* empty */ }
  }
  return leads;
};
