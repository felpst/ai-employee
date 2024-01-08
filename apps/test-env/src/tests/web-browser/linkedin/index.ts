import { WebBrowser, WebBrowserService } from "@cognum/tools";

export class LinkedinTest {
  constructor(
    private webBrowser = new WebBrowser(),
    private service = new WebBrowserService(webBrowser)
  ) { }

  async execute() {
    await this.webBrowser.start({ headless: false });

    await this.service.loadPage('https://www.linkedin.com/login?_l=en');

    const emailContext = 'Email or Phone';
    const emailElement = await this.service.findElementByContent('input', emailContext);

    const inputEmail = await this.service.inputText(process.env.LINKEDIN_USERNAME, {
      selectorType: 'css',
      elementSelector: emailElement.selector,
    });
    if (!inputEmail) throw new Error('Error inputing email');

    const passwordContext = 'Password';
    const passwordElement = await this.service.findElementByContent('input', passwordContext);

    await this.service.inputText(process.env.LINKEDIN_PASSWORD, {
      selectorType: 'css',
      elementSelector: passwordElement.selector,
    });

    const buttonContext = 'Sign in';
    const buttonElement = await this.service.findElementByContent('button', buttonContext);
    await this.service.click({
      selectorType: 'css',
      elementSelector: buttonElement.selector,
    });

    const searchContext = 'Search';
    const searchElement = await this.service.findElementByContent('input', searchContext);
    await this.service.inputText('Web Developer in Brazil', {
      selectorType: 'css',
      elementSelector: searchElement.selector,
    });

    await this.service.keyupEmiter('\uE007');

    const peopleButtonContext = 'See all people results';
    const peopleButtonElement = await this.service.findElementByContent('a', peopleButtonContext);
    await this.service.click({
      selectorType: 'css',
      elementSelector: peopleButtonElement.selector,
    });
    await this.service.scrollPage(1800);

    const nextButtonContext = 'Next';
    const nextButtonElement = await this.service.findElementByContent('button', nextButtonContext);
    await this.service.click({
      selectorType: 'css',
      elementSelector: nextButtonElement.selector,
    });

  }
}
