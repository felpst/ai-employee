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
    const result = await service.scrollPage(635, 'Vertical');
    expect(result).toBe(true);
  });

  it('Scroll page to element', async () => {
    const result = await service.scrollPage(500, 'Vertical', {
      selectorType: 'id',
      elementSelector: 'wrapper',
    });
    expect(result).toBe(true);
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });
});
