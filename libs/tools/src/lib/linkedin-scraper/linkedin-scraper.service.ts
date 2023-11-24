import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';
import { Person } from './person.entitie';

async function getDriver(profession: string): Promise<void> {
    const driver: WebDriver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    try {
        await driver.get('https://www.linkedin.com/login');

        const userInput = await driver.wait(until.elementLocated(By.id('username')), 5000);
        await userInput.sendKeys('renato@cognum.ai');

        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys('soeusei2023', Key.ENTER);

        await driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 100000);

        const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search']"));
        searchInput.clear()
        await searchInput.sendKeys(profession, Key.ENTER);

        await driver.wait(until.urlContains('linkedin.com/search/results'), 50000);

        const findButtons = await driver.findElements(By.className('search-reusables__filter-pill-button'));

        findButtons.forEach(async (button) => {
            const buttonName = await button.getText();
            if (buttonName === 'People') {
                button.click();
            }
        })

        const div = await driver.wait(until.elementLocated(By.xpath('//h2/div')), 1500000);
        await driver.wait(until.elementTextContains(div, 'About'), 1500000);
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.wait(until.elementLocated(By.className('artdeco-pagination')), 1500000);
        const buttonNext = await driver.findElements(By.className('artdeco-button'));


        //TODO: LOOP TO GET ALL PAGES
        buttonNext.forEach(async (button) => {
            const buttonName = await button.getText();
            console.log(buttonName);
            if (buttonName === 'Next') {
                button.click();
            }
        })
        await driver.wait(until.elementTextContains(div, 'About'), 1500000);

        const profilesList = await driver.findElements(By.className('entity-result__content'));
        console.log('list', profilesList);

        const personArray: Person[] = [];
        profilesList.forEach(async (profile) => {
            const nameLinkElement = await profile.findElement(By.className('app-aware-link'))
            const name = (await nameLinkElement.getText()).split('\n')[0];
            const title = await profile.findElement(By.className('entity-result__primary-subtitle')).getText();
            const location = await profile.findElement(By.className('entity-result__secondary-subtitle')).getText();
            const profileLink = await nameLinkElement.getAttribute('href');
            await Promise.all([name, title, location, profileLink])
            const person = new Person(name, title, location, profileLink);
            console.log(person);
            personArray.push(person);
        });
        console.log(personArray);

    } catch (error) {
        console.error(error);
    }
}

getDriver('Machine Learning Engineer');
