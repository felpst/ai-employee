import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Input Text tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
  });

  it('keyup input', async () => {
    await service.loadPage('https://www.google.com');
    await service.inputText('Quem é a namorada de Neymar?', {
      selectorType: 'id',
      fieldSelector: 'APjFqb',
    });

    const result = await service.keyupEmiter('\uE007');

    expect(result).toBe('Key  pressed');
  });

  it('keyup input 2', async () => {
    await service.loadPage('https://www.google.com');
    await service.inputText('Quem é a namorada de Neymar?', {
      selectorType: 'id',
      fieldSelector: 'APjFqb',
    });

    const result = await service.keyupEmiter('a', ['\uE008']);

    expect(result).toBe('Keys a,  pressed');
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });

});
