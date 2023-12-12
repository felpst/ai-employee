import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Load Page tool test', () => {
  jest.setTimeout(300000)
  const webBrowser = new WebBrowser()
  const service = new WebBrowserService(webBrowser)

  beforeAll(async () => {
    await webBrowser.start({ headless: false })
  });

  it('Google', async () => {
    const result = await service.loadPage('https://www.google.com');
    expect(result).toBe(true);
  })

  afterAll(async () => {
    await webBrowser.driver.close()
  });

});
