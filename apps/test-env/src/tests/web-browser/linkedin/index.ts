import { WebBrowser, WebBrowserService } from "@cognum/tools";

export class LinkedinTest {
  constructor(
    private webBrowser = new WebBrowser(),
    private service = new WebBrowserService(webBrowser)
  ) { }

  async execute() {
    await this.webBrowser.start({ headless: false });

    await this.service.loadPage('https://www.linkedin.com/login?_l=en');

    const emailContext = 'Email field';
    const emailElement = await this.service.findElementByContext(emailContext);
    console.log('emailElement', emailElement);

    const inputEmail = await this.service.inputText(process.env.LINKEDIN_USERNAME, {
      selectorType: emailElement.selectorType,
      elementSelector: emailElement.selector,
    }); 
    console.log('inputEmail', inputEmail);
    if (!inputEmail) throw new Error('Error inputing email');

    const passwordContext = 'Password field';
    const passwordElement = await this.service.findElementByContext(passwordContext);

    await this.service.inputText(process.env.LINKEDIN_PASSWORD, {
      selectorType: passwordElement.selectorType,
      elementSelector: passwordElement.selector,
    });

    const buttonContext = 'Login button';
    const buttonElement = await this.service.findElementByContext(buttonContext);
    await this.service.click({
      selectorType: buttonElement.selectorType,
      elementSelector: buttonElement.selector,
    });

    const searchContext = 'Search field';
    const searchElement = await this.service.findElementByContext(searchContext);
    await this.service.inputText('Web Developer in Brazil', {
      selectorType: searchElement.selectorType,
      elementSelector: searchElement.selector,
    });

    await this.service.keyupEmiter('\uE007');

    const peopleButtonContext = 'filter people button';
    const peopleButtonElement = await this.service.findElementByContext(peopleButtonContext);
    await this.service.click({
      selectorType: peopleButtonElement.selectorType,
      elementSelector: peopleButtonElement.selector,
    });

    const extractDataContext = 'Extract data of people';
    const extractDataElement = await this.service.findElementByContext(extractDataContext);
    const result = await this.service.extractData({
      selectorType: extractDataElement.selectorType,
      elementSelector: extractDataElement.selector,
    });
    console.log('result', result);


    const nextButtonContext = 'next Button in page';
    const nextButtonElement = await this.service.findElementByContext(nextButtonContext);
    const nextButtonClick = await this.service.click({
      selectorType: nextButtonElement.selectorType,
      elementSelector: nextButtonElement.selector,
    });

  }
}
