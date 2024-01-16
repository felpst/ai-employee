import { WebBrowser } from "@cognum/tools";
import { By, until } from "selenium-webdriver";
import * as fs from 'fs';

export class XandrExtractData {
    constructor(
        private webBrowser = new WebBrowser(),
    ) { }

    async execute() {
        await this.webBrowser.start({ headless: false });

        await this.webBrowser.driver.get('https://invest.xandr.com/login?redir=/dmp/segments');
        //Log In
        await this.webBrowser.driver.findElement(By.id('anxs-login-username')).sendKeys(process.env.XANDR_USERNAME);
        await this.webBrowser.driver.findElement(By.id('identity-check-button')).click();
        await this.webBrowser.driver.wait(until.elementLocated(By.xpath("//input[@id='i0116']")), 60000);
        await this.webBrowser.driver.findElement(By.xpath("//input[@id='i0116']")).sendKeys(process.env.XANDR_EMAIL);
        await this.webBrowser.driver.findElement(By.id('idSIButton9')).click();
        await this.webBrowser.driver.sleep(20000);
        await this.webBrowser.driver.findElement(By.xpath("//input[@id='i0118']")).sendKeys(process.env.XANDR_PASSWORD);
        await this.webBrowser.driver.findElement(By.id('idSIButton9')).click();
        await this.webBrowser.driver.wait(until.elementLocated(By.id('idBtn_Back')), 60000);
        await this.webBrowser.driver.findElement(By.id("idBtn_Back")).click();
        await this.webBrowser.driver.sleep(20000);
        console.log('logged in');

        //Go to segments
        const elements = await this.webBrowser.driver.findElements(By.className("lucid-Tabs-Tab"));
        await elements[2].click();
        console.log('clicked on segments');
        await this.webBrowser.driver.sleep(20000);
        //Get data from table
        let actualPage = 1;
        const totalDatas = [];
        const MAXIMUM_PAGES = 272;
        while (actualPage < MAXIMUM_PAGES) {
            await this.webBrowser.driver.sleep(20000);
            const trs = await this.webBrowser.driver.findElements(By.className("lucid-Table-Tr"));
            const buttons = await this.webBrowser.driver.findElements(By.className("lucid-Button"));
            const collectData = await this.colectDataFromTable(trs);
            totalDatas.push(...collectData);

            const saveToJson = JSON.stringify(collectData, null, 2);
            fs.appendFileSync('xandr.json', saveToJson);

            //next page
            await buttons[3].click();
            await this.webBrowser.driver.wait(
                until.stalenessOf(trs[0]),
                20000,
                'Elements not found within the time limit.'
            );
            actualPage++;
            console.log('page: ', actualPage);


        }
    }
    private async colectDataFromTable(trs: any[]) {
        let totalDataCollected = [];
        for (let i = 1; i < trs.length; i++) {
            const tr = trs[i];
            const nameAndProvider = await tr.findElements(By.className("dmp-Segments-Segment-Name"));
            const id = await tr.findElement(By.className("dmp-Segments-Segment-Id"));
            const price = await tr.findElement(By.className("dmp-Segments-row-price"));
            const impressionsAndUsers = await tr.findElements(By.className("lucid-Table-align-right"));
            const data = {
                name: await nameAndProvider[0].getText(),
                provider: await nameAndProvider[1].getText(),
                id: await id.getText(),
                price: await price.getText(),
                impressions: await impressionsAndUsers[0].getText(),
                users: await impressionsAndUsers[1].getText(),
            }
            totalDataCollected.push(data);
        }
        return totalDataCollected;
    }
}       