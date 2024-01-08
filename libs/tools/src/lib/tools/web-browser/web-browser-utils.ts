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

  async getInteractiveElementsXPathSelectors(): Promise<string[]> {
    const interactiveElements = ['button', 'input', 'a', 'textarea'];
    const selectors = await this.webBrowser.driver.executeScript((validElements: string[]) => {
      const interactiveElements = document.querySelectorAll(validElements.join(', '));

      const elementSelectors = Array.from(interactiveElements).map(
        (element) => {
          const segments = [];
          let currentElement = element;

          while (currentElement) {
            let segment = currentElement.tagName.toLowerCase();

            if (currentElement.id) {
              segment += `[@id='${currentElement.id}']`;
            }
            if (currentElement.classList.length > 0 && !currentElement.id) {
              segment += `[contains(@class, '${Array.from(currentElement.classList)[0]}')]`;
              // segment+=`[contains(@class, '${Array.from(currentElement.classList).join(' ')}')]`;
            }
            if (currentElement instanceof HTMLInputElement && currentElement.placeholder) {
              segment += (`[contains(@placeholder, '${currentElement.placeholder}')]`);
            }

            segments.unshift(segment);
            currentElement = currentElement.parentElement;
          }

          let path = `/${segments.join('/')}`;

          let textContent = '';
          if (element.childElementCount > 0) {
            textContent = element.childNodes[0]?.textContent?.trim();
          } else {
            textContent = element.textContent;
          }
          if (textContent) {
            path += `[text()[contains(.,'${sanitizeText(textContent)}')]]`;
          }

          const label = element.getAttribute('label');
          const ariaLabel = element.getAttribute('aria-label');
          if (label || ariaLabel) {
            path += `[contains(@${label ? 'label' : 'aria-label'},'${label || ariaLabel}')]`;
          }

          const href = element.getAttribute('href');
          if (href) {
            path += `[contains(@href,'${href}')]`;
          }

          return path;
        }
      );

      function sanitizeText(text) {
        let trimmedStr = text.trim();
        let result = trimmedStr.replace(/(?:^\n+|\n+$)/g, '');
        result = result.trim();

        return result;
      }

      return elementSelectors;
    }, [interactiveElements]) as string[];

    return selectors;
  }

  async mapPageElements(): Promise<Element[]> {
    return this.webBrowser.driver.executeScript(() => {
      const elements = document.querySelectorAll('a, button, input, textarea');

      return Array.from(elements || [])
        .map(element => ({
          tag: element.tagName.toLowerCase(),
          text: getElementText(element),
          selector: getElementSelector(element)
        })).filter(el => Boolean(el.text));

      function getElementText(element) {
        const text = element.textContent;
        const placeholder = element.placeholder;
        const label = Array.from<any>(element.labels || [])
          ?.map(label => label.textContent)
          .join('\n');

        return (text || label || placeholder)
          ?.split('\n')
          .filter(sub => Boolean(sub.trim()))
          .map(sub => sub.replace(/\s\s+/g, ' ').trim())
          .join('\n');
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