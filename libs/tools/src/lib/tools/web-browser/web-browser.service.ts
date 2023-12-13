import { WebBrowser } from "./web-browser";

export class WebBrowserService {
  constructor(
    private webBrowser: WebBrowser
  ) { }

  async loadPage(url: string): Promise<boolean> {
    this.webBrowser.driver.get(url);
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 3; i++) {
      console.log(`Waiting for page load: ${url}`);
      const currentUrl = await this.webBrowser.driver.getCurrentUrl();
      if (currentUrl.includes(url)) {
        return true;
      }
      await this.webBrowser.driver.sleep(5000);
    }
    return false;
  }

  async inspectElement(idOrClass: string): Promise<any> {
    try {
      let element;
      if (idOrClass.startsWith('.')) {
        element = await this.webBrowser.driver.findElement({ css: idOrClass });
      } else {
        element = await this.webBrowser.driver.findElement({ id: idOrClass });
      }

      const attributes = await this.webBrowser.driver
        .executeScript("let items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;", element);

      const html = await element.getAttribute('outerHTML');

      return { html, attributes };
    } catch (e) {
      console.error(e);
      return { html: '', attributes: { id: '', class: '', xpath: '' } };
    }
  }

}
