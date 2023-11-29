import { By, WebElement } from "selenium-webdriver";
import { Person } from "../linkedin-lead-scraper.interfaces";

export function formatPeople(people: WebElement[]): Promise<Person>[] {
  return people.map(async (profile) => {
    try {
      const nameLinkElement = await profile.findElement(By.className('app-aware-link'))
      const name = (await nameLinkElement.getText()).split('\n')[0];
      const title = await profile.findElement(By.className('entity-result__primary-subtitle')).getText();
      const location = await profile.findElement(By.className('entity-result__secondary-subtitle')).getText();
      const profileLink = await nameLinkElement.getAttribute('href');
      const person = new Person(name, title, location, profileLink);
      return person;
    } catch (error) {
      console.error('ocorreu um error', error)
      return null
    }
  });
};
