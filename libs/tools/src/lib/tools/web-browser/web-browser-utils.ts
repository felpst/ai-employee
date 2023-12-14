import { WebBrowser } from '.';
import { ElementSelector } from './web-browser.service';
type SelectorType = keyof typeof ElementSelector;

export default class WebBrowserUtils {
  constructor(protected webBrowser: WebBrowser) { }

  async getHtmlFromElement(selector: string, selectorType: SelectorType): Promise<string> {
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