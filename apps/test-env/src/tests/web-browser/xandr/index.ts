import { WebBrowser, WebBrowserService } from "@cognum/tools";
import { By } from "selenium-webdriver";

export class XandrTest {
    constructor(
        private webBrowser = new WebBrowser(),
        private service = new WebBrowserService(webBrowser)
    ) { }

    async execute() {
        await this.webBrowser.start({ headless: false });

        await this.service.loadPage('https://invest.xandr.com/login?redir=/dmp/segments');

        await this.webBrowser.driver.findElement(By.id('anxs-login-username')).sendKeys(process.env.XANDR_USERNAME);
        await this.webBrowser.driver.findElement(By.id('identity-check-button')).click();
        await this.webBrowser.driver.sleep(20000);
        await this.webBrowser.driver.findElement(By.xpath("//input[@id='i0116']")).sendKeys(process.env.XANDR_EMAIL);
        await this.webBrowser.driver.findElement(By.id('idSIButton9')).click();
        await this.webBrowser.driver.sleep(20000);
        await this.webBrowser.driver.findElement(By.xpath("//input[@id='i0118']")).sendKeys(process.env.XANDR_PASSWORD);
        await this.webBrowser.driver.findElement(By.id('idSIButton9')).click();
        await this.webBrowser.driver.sleep(20000);

        await this.webBrowser.driver.findElement(By.id("idBtn_Back")).click();
        await this.webBrowser.driver.sleep(20000);
        console.log('logged in');

        const elements = await this.webBrowser.driver.findElements(By.className("lucid-Tabs-Tab"));
        console.log(elements);

        await elements[2].click();
        console.log('clicked on segments');

    }
}
