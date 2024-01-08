import { WebBrowser, WebBrowserService } from "@cognum/tools";

export class FindElementTest {

  constructor(
    private webBrowser = new WebBrowser(),
    private service = new WebBrowserService(webBrowser)
  ) {

  }

  async execute() {
    await this.webBrowser.start({ headless: false });

    await this.service.loadPage('https://www.google.com');

    const element = await this.service.findElementByContent('input', 'Search');
  }

}
