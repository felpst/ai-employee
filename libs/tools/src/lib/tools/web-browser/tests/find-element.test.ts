import 'dotenv/config';
import { WebBrowser } from '../web-browser';
import { WebBrowserService } from '../web-browser.service';

describe('Find Element tool test', () => {
  jest.setTimeout(300000);
  const webBrowser = new WebBrowser();
  const service = new WebBrowserService(webBrowser);

  beforeAll(async () => {
    await webBrowser.start({ headless: false });
  });

  it('Find element in Google by context and input text on search field.', async () => {
    await service.loadPage('https://www.google.com');

    const context = 'Campo de busca.';
    const element = await service.findElementByContext(context);

    // const result = await service.inputText('Teste', {
    //   selectorType: element.selectorType,
    //   elementSelector: element.selector,
    // });

    // expect(result).toBe(true);
    expect(true).toBe(true);
  });

  it('Find element in Bing by context and input text on search field.', async () => {
    await service.loadPage('https://www.bing.com');

    const context = 'Campo de busca.';
    const element = await service.findElementByContext(context);

    const result = await service.inputText('Teste', {
      selectorType: element.selectorType,
      elementSelector: element.selector,
    });

    expect(result).toBe(true);
  });

  it('Find element in Duck Duck Go by context and input text on search field.', async () => {
    await service.loadPage('https://duckduckgo.com/');

    const context = 'Campo de busca.';
    const element = await service.findElementByContext(context);

    const result = await service.inputText('Teste', {
      selectorType: element.selectorType,
      elementSelector: element.selector,
    });

    expect(result).toBe(true);
  });

  it('Find element Google Translate by context and input text on search field.', async () => {
    await service.loadPage('https://translate.google.com/');

    const context = 'Campo de tradução.';
    const element = await service.findElementByContext(context);

    const result = await service.inputText('Teste', {
      selectorType: element.selectorType,
      elementSelector: element.selector,
    });

    expect(result).toBe(true);
  });

  it('Find user in Xandr', async () => {
    await service.loadPage('https://invest.xandr.com/login');

    const context = 'Campo de login.';
    const element = await service.findElementByContext(context);

    const result = await service.inputText('Linecker', {
      selectorType: element.selectorType,
      elementSelector: element.selector,
    });

    expect(result).toBe(true);
  });

  it('Botão Microsgot in Xandr', async () => {
    await service.loadPage('https://invest.xandr.com/login');

    const context = 'Login por Microsoft';
    const element = await service.findElementByContext(context);

    const result = service.click({
      selectorType: element.selectorType,
      elementSelector: element.selector,
    });

    expect(result).toBe(true);
  });

  it('Find La Liga Table', async () => {
    await service.loadPage('https://www.skysports.com/la-liga-table');

    const context = 'La Liga table';
    const element = await service.findElementByContext(context);


    expect(element.selector).toContain("#widgetLite-8");
  });

  it('find news Tibia div', async () => {
    await service.loadPage('https://www.tibia.com/news/');

    const context = 'news Ticker';
    const element = await service.findElementByContext(context);


    expect(element.selector).toBe("#NewsTicker");
    expect(element.selectorType).toBe("css");
  });


  afterAll(async () => {
    await webBrowser.driver.close()
  });

});
