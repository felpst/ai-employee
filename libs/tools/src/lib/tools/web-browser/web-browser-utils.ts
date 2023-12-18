import { IWebBrowser } from '@cognum/interfaces';
import { ElementSelector } from './common/element-schema';
export default class WebBrowserUtils {
  constructor(protected webBrowser: IWebBrowser) { }

  async getHtmlFromElement(selector: string, selectorType?: ElementSelector): Promise<string> {
    switch (selectorType) {
      case 'id':
        selector = `#${selector}`;
        break;
      case 'xpath':
        selector = selector
          .replace('//', '')
          .replace('@', '');
        break;
      default: break;
    }

    // TODO ideas: tirar atributos inuteis (eventos, name), remover elementos improvaveis

    return this.webBrowser.driver.executeScript((selector: string) => {
      var element = (document as any).querySelector(`${selector}`).cloneNode(true);

      // Remove todos os elementos <script> e <style> do clone
      Array.from(element.getElementsByTagName('script')).forEach((el: any) => el.remove());
      Array.from(element.getElementsByTagName('style')).forEach((el: any) => el.remove());
      Array.from(element.getElementsByTagName('svg')).forEach((el: any) => el.remove());
      Array.from(element.getElementsByTagName('hr')).forEach((el: any) => el.remove());

      var elements = element.querySelectorAll('[jsaction]');
      elements.forEach(element => element.removeAttribute('jsaction'));

      return element.innerHTML;
    }, [selector]);
  }
}
