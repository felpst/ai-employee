import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';
import { Person } from './person.entitie';

async function getDriver(profession: string): Promise<void> {
    const driver: WebDriver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    try {
        await driver.get('https://www.linkedin.com/login');

        const userInput = await driver.wait(until.elementLocated(By.id('username')), 5000);
        await userInput.sendKeys('seu-email@gmail.com');

        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys('password', Key.ENTER);

        await driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 100000);

        const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search']"));
        searchInput.clear()
        await searchInput.sendKeys(profession, Key.ENTER);

        await driver.wait(until.urlContains('linkedin.com/search/results'), 50000);

        const element = await driver.findElement(By.xpath('//*[@id="search-reusables__filters-bar"]/ul/li[2]/button'));

        element.click();

        await driver.wait(until.urlContains('linkedin.com/search/results/people'), 50000);

        const profilesList = await driver.findElements(By.className('entity-result__content'));

        const peopleArray = [];
        profilesList.forEach(async (profile) => {
            const nameLinkElement = await profile.findElement(By.className('app-aware-link'))
            const name = (await nameLinkElement.getText()).split('\n')[0];
            const title = await profile.findElement(By.className('entity-result__primary-subtitle')).getText();
            const location = await profile.findElement(By.className('entity-result__secondary-subtitle')).getText();
            const profileLink = await nameLinkElement.getAttribute('href');
            await Promise.all([name, title, location, profileLink])
            const person = new Person(name, title, location, profileLink);
            console.log(person);
            peopleArray.push(person);
        });

        // const elementoSpan = await profilesList.findElement(By.css('span[aria-hidden="true"]'));
        // const text = await elementoSpan.getText()

    } catch (error) {
        console.error(error);
    }
}

getDriver('Machine Learning Engineer');
