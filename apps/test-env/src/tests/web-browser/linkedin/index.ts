// import { WebBrowser, WebBrowserService } from "@cognum/tools";

// export class LinkedinTest {
//   constructor(
//     private webBrowser = new WebBrowser(),
//     private service = new WebBrowserService(webBrowser)
//   ) { }

//   async execute() {
//     await this.webBrowser.start({ headless: false });

//     await this.service.loadPage('https://www.linkedin.com/login?_l=en');

//     const emailContext = 'Email field';
//     const emailElement = await this.service.findElementById(emailContext);

//     const inputEmail = await this.service.inputText(process.env.LINKEDIN_USERNAME, {
//       selectorType: emailElement.selectorType,
//       elementSelector: emailElement.selector,
//     });
//     if (!inputEmail) throw new Error('Error inputing email');

//     const passwordContext = 'Password field';
//     const passwordElement = await this.service.findElementByContext(passwordContext);

//     await this.service.inputText(process.env.LINKEDIN_PASSWORD, {
//       selectorType: passwordElement.selectorType,
//       elementSelector: passwordElement.selector,
//     });

//     const buttonContext = 'Login button';
//     const buttonElement = await this.service.findElementByContext(buttonContext);
//     await this.service.click({
//       selectorType: buttonElement.selectorType,
//       elementSelector: buttonElement.selector,
//     });

//     const searchContext = 'Global search field';
//     const searchElement = await this.service.findElementByContext(searchContext);
//     await this.service.inputText('Web Developer in Brazil', {
//       selectorType: searchElement.selectorType,
//       elementSelector: searchElement.selector,
//     });

//     await this.service.keyupEmiter('\uE007');

//     const peopleButtonContext = 'People Filter Button';
//     const peopleButtonElement = await this.service.findElementByContext(peopleButtonContext);
//     await this.service.click({
//       selectorType: peopleButtonElement.selectorType,
//       elementSelector: peopleButtonElement.selector,
//     });


//     await this.service.scrollPage(1800);

//     const extractContext = 'extract data result container';
//     const extractElement = await this.service.findElementByContextToExtract(extractContext);
//     await this.service.extractData({
//       selectorType: extractElement.selectorType,
//       elementSelector: extractElement.selector,
//     });

//     const nextButtonContext = 'next page button';
//     const nextButtonElement = await this.service.findElementByContext(nextButtonContext);
//     await this.service.click({
//       selectorType: nextButtonElement.selectorType,
//       elementSelector: nextButtonElement.selector,
//     });

//   }
// }
