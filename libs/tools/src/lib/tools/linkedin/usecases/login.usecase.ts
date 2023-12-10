import { By, Key, until } from 'selenium-webdriver';
import { LinkedInDriver } from "../drivers/linkedin.driver";
import { ILinkedInAuth } from "../linkedin.interfaces";

export class LoginUseCase {

  static ERROR_MESSAGES = {
    NO_PAGE_FOUND: 'Error on login: no page found',
    NO_USER_INPUT_FOUND: 'Error on login: no user input found',
    NO_PASSWORD_INPUT_FOUND: 'Error on login: no password input found',
    USERNAME_OR_PASSWORD_INCORRECT: 'Error on login: username or password incorrect',
    NEED_TO_VERIFY_LOGIN: 'Error on login: need to verify login',
  }

  constructor(
    private linkedinDriver: LinkedInDriver
  ) { }

  async execute(auth: ILinkedInAuth) {
    if (this.linkedinDriver.isAuthenticaded) return true;

    try {
      await this._goToLoginPage()
      await this._login(auth)
      await this._checkIfLogged()
      return this.linkedinDriver.isAuthenticaded;
    } catch (error) {
      console.error(error.message)
      throw new Error(error.message);
    }
  }

  get driver() {
    return this.linkedinDriver.driver;
  }

  private async _goToLoginPage() {
    this._console('Logging in...');
    const loginUrl = 'https://www.linkedin.com/login';
    await this.driver.get(loginUrl);

    let getCurrentUrl = await this.driver.getCurrentUrl()
    this._console('getCurrentUrl: ' + getCurrentUrl);
    if (!getCurrentUrl.includes(loginUrl)) {
      throw new Error(LoginUseCase.ERROR_MESSAGES.NO_PAGE_FOUND);
    }
  }

  private async _login(auth: ILinkedInAuth) {
    // Set user
    this._console('[Login] Set user...');
    const userInput = await this.driver.wait(until.elementLocated(By.id('username')), 5000);
    if (!userInput) {
      throw new Error(LoginUseCase.ERROR_MESSAGES.NO_USER_INPUT_FOUND);
    }
    await userInput.sendKeys(auth.user);
    this._console('[Login] User set...');

    // Set password
    this._console('[Login] Set password...');
    const passwordInput = await this.driver.findElement(By.id('password'));
    await passwordInput.sendKeys(auth.password, Key.RETURN);
    if (!passwordInput) {
      throw new Error(LoginUseCase.ERROR_MESSAGES.NO_PASSWORD_INPUT_FOUND);
    }
    this._console('[Login] Password set...');

    // Wait loading
    await this.driver.sleep(5000);
  }

  private async _checkIfLogged() {
    const getCurrentUrl = await this.driver.getCurrentUrl();
    this._console('[_checkIfLogged] getCurrentUrl: ' + getCurrentUrl);

    if (getCurrentUrl.includes('https://www.linkedin.com/feed')) {
      this.linkedinDriver.isAuthenticaded = true;
      return true;
    } else if (getCurrentUrl.includes('https://www.linkedin.com/login')) {
      throw new Error('Error on login: username or password incorrect');
    } else if (getCurrentUrl.includes('https://www.linkedin.com/checkpoint/challenge/verify')) {
      const pageSource = await this.driver.wait(until.elementLocated(By.css('body')), this.linkedinDriver.timeoutMS).getAttribute('innerHTML');
      console.log('pageSource: ', pageSource);
      await this.driver.sleep(2000);
      throw new Error(LoginUseCase.ERROR_MESSAGES.NEED_TO_VERIFY_LOGIN);
    } else {
      throw new Error(LoginUseCase.ERROR_MESSAGES.NO_PAGE_FOUND);
    }
    // await this.driver.wait(until.urlIs('https://www.linkedin.com/feed/'), 100000);
  }

  private _console(message: any) {
    if (process.env.DEBUG === 'true') {
      console.log(message);
    }
  }

}
