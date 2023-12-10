import { LinkedInDriver } from "../drivers/linkedin.driver";

export class CloseUseCase {

  constructor(
    private driver: LinkedInDriver
  ) { }

  async execute() {
    await this.driver.close()
  }

}
