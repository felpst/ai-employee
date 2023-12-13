import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Find Elements tool test', () => {
    jest.setTimeout(300000)
    const webBrowser = new WebBrowser()
    const service = new WebBrowserService(webBrowser)

    beforeAll(async () => {
        await webBrowser.start({ headless: false })
    });

    it('Find element by id', async () => {
        await service.loadPage('https://monetize.xandr.com/login');
        const find = await service.inspectElement('anxs-login-username');
        console.log(find);
        expect(find).toContain('anxs-login-username');

    })

    it('Find element by class', async () => {
        await service.loadPage('https://monetize.xandr.com/login');
        const find = await service.inspectElement('button-primary');
        console.log(find);
        expect(find).toContain('Next');

    })


    afterAll(async () => {
        await webBrowser.driver.close()
    });

});
