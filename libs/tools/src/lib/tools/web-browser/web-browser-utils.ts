import { IWebBrowser } from '@cognum/interfaces';
import { ElementSelector } from './common/element-schema';
import { Element } from './web-browser.service';

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

      element.querySelectorAll('*').forEach(el => {
        el.removeAttribute('jsaction');
        if (el.style.display === 'none') el.remove();
      });

      var removeComments = (node: any) => {
        if (!node) return;
        node.childNodes.forEach((child: any) => {
          if (child.nodeType === 8) { // Node.COMMENT_NODE
            child.remove();
          } else {
            removeComments(child);
          }
        });
      };
      removeComments(element);

      var html = element.innerHTML;
      html = html.replace(/\n/g, '\n').trim();
      html = html.replace(/\s+/g, ' ').trim();

      return html;
    }, [selector]);
  }

  async mapPageElements(): Promise<Element[]> {
    return this.webBrowser.driver.executeScript(() => {
      const elements = document.body.querySelectorAll('a, button, input, textarea, span');

      return Array.from(elements || [])
        .filter(isElementOnViewPort)
        .filter(el => el.checkVisibility())
        .map(element => ({
          tag: element.tagName.toLowerCase(),
          text: getElementText(element),
          selector: getElementSelector(element)
        }))
        .filter(el => Boolean(el.text));

      function isElementOnViewPort(element) {
        var rect = element.getBoundingClientRect();
        var html = document.documentElement;
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || html.clientHeight) &&
          rect.right <= (window.innerWidth || html.clientWidth)
        );
      }

      function getElementText(element) {
        const label = (Array.from<any>(element.labels || [])
          ?.map(label => label.textContent)
          .join('\n'));

        return (
          element.textContent?.trim()
          || label?.trim()
          || element.ariaLabel?.trim()
          || element.placeholder?.trim()
          || element.ariaPlaceholder?.trim()
          || element.title?.trim()
        )?.split('\n')
          .filter(sub => Boolean(sub.trim()))
          .map(sub => sub.replace(/\s\s+/g, ' ').trim())
          .join('<br>');
      }

      function getElementSelector(element) {
        if (element.tagName.toLowerCase() === 'body') return 'body';
        const names = [];
        while (element.parentElement && element.tagName.toLowerCase() !== 'body') {
          if (element.id) {
            names.unshift('#' + element.getAttribute('id'));
            break;
          } else {
            let c = 1, e = element;
            for (; e.previousElementSibling; e = e.previousElementSibling, c++);
            names.unshift(element.tagName.toLowerCase() + ':nth-child(' + c + ')');
          }
          element = element.parentElement;
        }
        return names.join(' > ');
      }
    });
  }
}