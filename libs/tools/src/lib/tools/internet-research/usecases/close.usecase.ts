import { WebBrowser } from '@cognum/browser';

export class CloseUseCase {

  constructor(
    private driver: WebBrowser
  ) { }

  async execute() {
    await this.driver.close();
  }

}
