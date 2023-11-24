import { Builder, By, Key, WebDriver, until } from 'selenium-webdriver';

async function getDriver(): Promise<void> {
    const driver: WebDriver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    try {
        await driver.get('https://www.linkedin.com/login');

        const userInput = await driver.wait(until.elementLocated(By.id('username')), 5000);
        await userInput.sendKeys('seu-email@gmail.com');

        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys('password', Key.ENTER);

        await driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 10000);

        const searchInput = await driver.findElement(By.xpath("//input[@placeholder='Search']"));
        searchInput.clear()
        await searchInput.sendKeys('Machine Learning Engineer', Key.ENTER);

        const elementoLink = await driver.findElement(By.css('a[href*="linkedin.com/search/results/people"]'));

        elementoLink.click();
    } catch (error) {
        console.error(error);
    }
}

getDriver();
