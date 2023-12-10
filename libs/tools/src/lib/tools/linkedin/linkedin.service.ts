import { LinkedInDriver } from "./drivers/linkedin.driver";
import { ILinkedInAuth } from "./linkedin.interfaces";
import { CloseUseCase } from "./usecases/close.usecase";
import { FindLeadsUseCase, ILinkedInFindLeadsRequest } from "./usecases/find-leads.usecase";
import { LoginVerifyUseCase } from "./usecases/login-verify.usecase";
import { LoginUseCase } from "./usecases/login.usecase";
import { StartUseCase } from "./usecases/start.usecase";

export class LinkedInService {
  linkedinDriver: LinkedInDriver;

  async start() {
    this.linkedinDriver = await new StartUseCase().execute()
  }

  async login(auth: ILinkedInAuth) {
    try {
      const isAuthenticaded = await new LoginUseCase(this.linkedinDriver).execute(auth)
      console.log('isAuthenticaded', isAuthenticaded);
      return isAuthenticaded;
    } catch (error) {
      if (error.message === LoginUseCase.ERROR_MESSAGES.NEED_TO_VERIFY_LOGIN) {
        return this.loginVerify(auth.verificationCode);
      }
      throw error;
    }
  }

  async loginVerify(verificationCode: string) {
    try {
      await new LoginVerifyUseCase(this.linkedinDriver).execute(verificationCode)
    } catch (error) {
      console.error(error.message)
    }
  }

  async findLeads(settings: ILinkedInFindLeadsRequest) {
    const leads = await new FindLeadsUseCase(this.linkedinDriver).execute(settings)
    return leads;
  }

  async stop() {
    await new CloseUseCase(this.linkedinDriver).execute()
  }

}
