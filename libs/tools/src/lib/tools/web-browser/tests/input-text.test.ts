import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../services/web-browser.service';

describe('Input Text tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
  });

  it('Google search input', async () => {
    await service.loadPage('https://www.google.com');
    const result = await service.inputText('Quem é a namorada de Neymar?', {
      selectorType: 'id',
      elementSelector: 'APjFqb',
    });

    expect(result).toBe(true);
  });

  it('Google search input 2', async () => {
    await service.loadPage('https://duckduckgo.com/');
    const result = await service.inputText('Quem é a namorada de Neymar?', {
      selectorType: 'className',
      elementSelector: 'header_searchbox__5Ei30',
    });

    expect(result).toBe(true);
  });

  afterAll(async () => {
    // await webBrowser.driver.close();
  });

});
