import { WebBrowser } from "../../web-browser/web-browser";

export class CloseUseCase {

  constructor(
    private driver: WebBrowser
  ) { }

  async execute() {
    await this.driver.close()
  }

}
