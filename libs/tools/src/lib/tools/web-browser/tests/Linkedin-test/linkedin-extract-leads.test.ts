import 'dotenv/config';
import { WebBrowser } from '../../web-browser';
import { WebBrowserService } from '../../web-browser.service';

describe('Find Element tool test', () => {
    jest.setTimeout(1500000000);
    const webBrowser = new WebBrowser();
    const service = new WebBrowserService(webBrowser);

    beforeAll(async () => {
        await webBrowser.start({ headless: false });
    });

    it('Botão Microsgot in Xandr', async () => {
        await service.loadPage('https://www.linkedin.com/login?_l=en');

        const emailContext = 'Email input in Linkedin login page';
        const emailElement = await service.findElementByContext(emailContext);

        const inputEmail = await service.inputText('devrenatorodrigues@gmail.com', {
            selectorType: emailElement.selectorType,
            elementSelector: emailElement.selector,
        });

        const passwordContext = 'password input in Linkedin login page';
        const passwordElement = await service.findElementByContext(passwordContext);

        const inputPassword = await service.inputText('Cs4ever1305@', {
            selectorType: passwordElement.selectorType,
            elementSelector: passwordElement.selector,
        });

        const buttonContext = 'button input in Linkedin login page';
        const buttonElement = await service.findElementByContext(buttonContext);
        const buttonClick = await service.click({
            selectorType: buttonElement.selectorType,
            elementSelector: buttonElement.selector,
        });

        const searchContext = 'search input in Linkedin feed page';
        const searchElement = await service.findElementByContext(searchContext);
        const inputSearch = await service.inputText('Web Developer in Brazil', {
            selectorType: searchElement.selectorType,
            elementSelector: searchElement.selector,
        });


        const peopleButtonContext = 'People Button in page';
        const peopleButtonElement = await service.findElementByContext(peopleButtonContext);
        const peopleButtonClick = await service.click({
            selectorType: peopleButtonElement.selectorType,
            elementSelector: peopleButtonElement.selector,
        });

        const nextButtonContext = 'next Button in page';
        const nextButtonElement = await service.findElementByContext(nextButtonContext);
        const nextButtonClick = await service.click({
            selectorType: nextButtonElement.selectorType,
            elementSelector: nextButtonElement.selector,
        });


    });



    afterAll(async () => {
        // await webBrowser.driver.close()
    });

});
