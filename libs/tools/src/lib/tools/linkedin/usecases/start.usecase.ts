import { BrowserType } from "@cognum/interfaces";
import { WebBrowser } from "../../web-browser";

export class StartUseCase {

  async execute(browser: BrowserType) {
    const webBrowser = new WebBrowser();
    await webBrowser.start({ browser })
    return webBrowser;
  }

}
