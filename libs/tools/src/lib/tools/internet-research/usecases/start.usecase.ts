import { WebBrowser } from '@cognum/browser';
import { BrowserType } from "@cognum/interfaces";

export class StartUseCase {

  async execute(browser: BrowserType) {
    const webBrowser = new WebBrowser();
    await webBrowser.open({ browser });
    return webBrowser;
  }

}
