import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Click Button tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
  });

  it('Wikipedia click search button', async () => {
    await service.loadPage('https://wikipedia.org');
    const result = await service.clickButton({
      selectorType: 'css',
      elementSelector: 'button.pure-button',
    });

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });

});
