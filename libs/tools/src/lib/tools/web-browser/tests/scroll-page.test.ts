import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../services/web-browser.service';

describe('Scroll Page tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
    await service.loadPage('https://g1.globo.com');
  });

  it('Scroll page to location', async () => {
    const result = await service.scrollPage(4235);
    expect(result).toBe(true);
  });

  it('Scroll page to element in page', async () => {
    const result = await service.scrollPage(null, {
      selectorType: 'id',
      elementSelector: 'bstn-launcher'
    });
    expect(result).toBe(true);
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });

});
