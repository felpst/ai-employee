import { BrowserType, WebBrowser } from "../../../web-browser/web-browser";

export class StartUseCase {

  async execute(browser: BrowserType) {
    const webBrowser = new WebBrowser();
    await webBrowser.start(browser)
    return webBrowser;
  }

}
