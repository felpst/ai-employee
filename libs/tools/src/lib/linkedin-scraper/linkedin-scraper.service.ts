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
        await passwordInput.sendKeys('pass2023', Key.ENTER);

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

        // await driver.wait(until.elementLocated(By.className('artdeco-card')), 150000);

        // const buttoNext = await driver.findElements(By.className('artdeco-button'));
        // console.log('next', buttoNext);
        // buttoNext.forEach(async (button) => {
        //     const buttonName = await button.getText();
        //     if (buttonName === 'Next') {
        //         button.click();
        //     }
        // })

        const profilesList = await driver.findElements(By.className('entity-result__content'));

        const personArray = profilesList.map(async (profile) => {
            const nameLinkElement = await profile.findElement(By.className('app-aware-link'))
            const name = (await nameLinkElement.getText()).split('\n')[0];
            const title = await profile.findElement(By.className('entity-result__primary-subtitle')).getText();
            const location = await profile.findElement(By.className('entity-result__secondary-subtitle')).getText();
            const profileLink = await nameLinkElement.getAttribute('href');
            await Promise.all([name, title, location, profileLink])
            new Person(name, title, location, profileLink);
        });
        console.log(personArray);

    } catch (error) {
        console.error(error);
    }
}

getDriver('Machine Learning Engineer');
