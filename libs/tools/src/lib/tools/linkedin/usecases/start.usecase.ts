import { LinkedInDriver } from "../drivers/linkedin.driver";

export class StartUseCase {

  async execute() {
    const linkedinDriver = new LinkedInDriver();
    await linkedinDriver.start()
    return linkedinDriver;
  }

}
