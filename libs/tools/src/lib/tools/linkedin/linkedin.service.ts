import { WebBrowser } from "../web-browser/web-browser";
import { BrowserType } from "./drivers/linkedin.driver";
import { ILinkedInAuth } from "./linkedin.interfaces";
import { CloseUseCase } from "./usecases/close.usecase";
import { FindLeadsUseCase, ILinkedInFindLeadsRequest } from "./usecases/find-leads.usecase";
import { LoginVerifyUseCase } from "./usecases/login-verify.usecase";
import { LoginUseCase } from "./usecases/login.usecase";
import { StartUseCase } from "./usecases/start.usecase";

export class LinkedInService {
  webBrowser: WebBrowser;
  isAuthenticaded: boolean = false;

  async start(browser: BrowserType = 'chrome') {
    this.webBrowser = await new StartUseCase().execute(browser)
  }

  async login(auth: ILinkedInAuth) {
    try {
      this.isAuthenticaded = await new LoginUseCase(this.webBrowser).execute(auth)
      console.log('isAuthenticaded', this.isAuthenticaded);
      return this.isAuthenticaded;
    } catch (error) {
      console.error(error)
      if (error.message === LoginUseCase.ERROR_MESSAGES.NEED_TO_VERIFY_LOGIN) {
        return this.loginVerify(auth.verificationCode);
      }
      throw error;
    }
  }

  async loginVerify(verificationCode: string) {
    try {
      await new LoginVerifyUseCase(this.webBrowser).execute(verificationCode)
    } catch (error) {
      console.error(error.message)
    }
  }

  async findLeads(settings: ILinkedInFindLeadsRequest) {
    const leads = await new FindLeadsUseCase(this.webBrowser).execute(settings)
    return leads;
  }

  async stop() {
    await new CloseUseCase(this.webBrowser).execute()
  }

}
