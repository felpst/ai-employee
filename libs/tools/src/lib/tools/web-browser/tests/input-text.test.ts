import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Input Text tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
    await service.loadPage('https://www.google.com');
  });

  it('Google search input', async () => {
    const result = await service.inputText('Quem é a namorada de Neymar?', {
      selectorType: 'id',
      fieldSelector: 'APjFqb',
    });

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });

});
