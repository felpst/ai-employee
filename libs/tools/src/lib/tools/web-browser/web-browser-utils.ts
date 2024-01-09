import { IWebBrowser } from '@cognum/interfaces';
import { ElementSelector } from './common/element-schema';
import { Element } from './web-browser.service';
import { JSDOM } from 'jsdom';

const ELEMENT_OUT_OF_VIEW_ATTR = 'isElementOutsideViewPort';

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

  async mapVisibleElements(): Promise<Element[]> {
    const stringHTML = await this.getHtml();
    const document = new JSDOM(stringHTML, { contentType: 'text/html' }).window.document;

    const elements = document.body.querySelectorAll('a, button, input, textarea, span');

    return Array.from(elements || [])
      .filter(el => this._filterVisibleElement(el))
      .map(element => ({
        tag: element.tagName.toLowerCase(),
        text: this._getElementText(element),
        selector: this._getElementSelector(element)
      }))
      .filter(el => Boolean(el.text));
  }

  /** Gets page html and sets an attribute for elements out of view
   *  @returns {string}
   */
  async getHtml(): Promise<string> {
    return this.webBrowser.driver.executeScript((elOutOfViewAttrName: string) => {
      document.querySelectorAll('body *')
        .forEach(element => {
          if (!isInViewPort(element) || !element.checkVisibility())
            element.setAttribute(elOutOfViewAttrName, 'true');
        });

      return document.documentElement.outerHTML;

      function isInViewPort(element) {
        const rect = element.getBoundingClientRect();
        const html = document.documentElement;

        return (
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < (window.innerHeight || html.clientHeight) &&
          rect.left < (window.innerWidth || html.clientWidth)
        );
      }
    }, [ELEMENT_OUT_OF_VIEW_ATTR]);
  }

  private _getElementText(element: globalThis.Element) {
    const label = (Array.from<globalThis.Element>(element['labels'] || [])
      ?.map(label => label.textContent)
      .join('\n'));

    return (
      element.textContent?.trim()
      || label?.trim()
      || element.getAttribute('label')?.trim()
      || element.ariaLabel?.trim()
      || element.getAttribute('placeholder')?.trim()
      || element.ariaPlaceholder?.trim()
      || element.getAttribute('title')?.trim()
    )?.split('\n')
      .filter(sub => Boolean(sub.trim()))
      .map(sub => sub.replace(/\s\s+/g, ' ').trim())
      .join('<br>');
  }

  private _getElementSelector(element: globalThis.Element) {
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

  private _filterVisibleElement(element: globalThis.Element) {
    if (element.getAttribute(ELEMENT_OUT_OF_VIEW_ATTR))
      return false;
    return true;
  }
}