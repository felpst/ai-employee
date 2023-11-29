import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';
import { Person } from './person.entitie';
import { structInfos } from './structInfos.utils';

export class LinkedinScraper {
    private _username: string;
    private _password: string;

    constructor(
        username: string,
        password: string
    ) {
        this._username = username;
        this._password = password;
    }

    async forProfession(profession: string, quantity: number = 10): Promise<Person[]> {
        const driver: WebDriver = await new Builder().forBrowser('chrome').build();

        await driver.manage().window().maximize();

        try {
            await driver.get('https://www.linkedin.com/login');

            const userInput = await driver.wait(until.elementLocated(By.id('username')), 5000);
            await userInput.sendKeys(this._username);

            const passwordInput = await driver.findElement(By.id('password'));
            await passwordInput.sendKeys(this._password, Key.RETURN);

            await driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 100000);

            const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search']"));
            searchInput.clear()
            await searchInput.sendKeys(profession, Key.RETURN);

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

            await driver.wait(until.elementLocated(By.className('artdeco-pagination__button')), 1500000);

            const persons = [];

            try {
                while (persons.length < quantity) {
                    let nextButton = null

                    await driver.wait(
                        until.elementsLocated(By.className('entity-result__content')),
                        20000,
                        'Elements not found within the time limit.'
                    );

                    const profilesList = await driver.findElements(By.className('entity-result__content'));
                    const personsInfos = structInfos(profilesList);
                    const personArray = await Promise.all(personsInfos);
                    persons.push(...personArray);
                    console.log(persons);

                    driver.sleep(5000);

                    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                    nextButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Next')]")), 10000);
                    nextButton = await driver.findElement(By.xpath("//button[contains(., 'Next')]"));
                    await driver.wait(until.elementIsEnabled(nextButton), 5000);
                    await nextButton.click();

                    await driver.wait(
                        until.stalenessOf(profilesList[profilesList.length - 1]),
                        20000,
                        'Elements not found within the time limit.'
                    );

                }
                return persons;
            } catch (error) {
                error.message = 'Not enough profiles found.';
            }
        } catch (error) {
            error.message = 'Not enough profiles found.';
        }
        finally {
            await driver.quit();
        }
    }
}
