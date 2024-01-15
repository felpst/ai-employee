import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../services/web-browser.service';

describe('Extract Data tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
  });

  it('La liga table', async () => {
    await service.loadPage('https://www.laliga.com/en-GB/where-to-watch-laliga');
    await webBrowser.driver.sleep(2000);

    const res = await service.extractData('#__next > div.styled__BorderContainer-sc-1sq1srj-8.ksxJIT > div > div > div > table');

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('W3schools table', async () => {
    await service.loadPage('https://www.w3schools.com/html/html_tables.asp');
    const res = await service.extractData('#customers');

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('Globo list', async () => {
    await service.loadPage('https://redeglobo.globo.com/sao-paulo/programacao/');
    const res = service.extractData('#grade-pagina');

    await expect(res).rejects.toThrow('Error trying to get data from HTML.');
  });

  afterAll(async () => {
    await webBrowser.driver.close();
  });
});
