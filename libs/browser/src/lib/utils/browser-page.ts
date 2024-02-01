import { WebBrowser } from './web-browser';
import { JSDOM, VirtualConsole } from 'jsdom';
import { By } from 'selenium-webdriver';
import prettier from 'prettier';

const ELEMENT_OUT_OF_VIEW_ATTR = 'is-out-of-view';
const INTERNAL_ELEMENT_ID = 'selector-id';
const UNWANTED_ELEMENTS = ['svg', 'script', 'style', 'noscript', 'defs'];

export default class BrowserPage {
  private _selectorsMapping: Record<string, string> = {};

  constructor(private browser: WebBrowser) { }

  getSelectorById(selectorId: string): string {
    return this._selectorsMapping[selectorId];
  }

  async getElementHtml(selector: string): Promise<string> {
    const el = await this.browser.driver.findElement(By.css(selector));
    const html = await el.getAttribute('outerHTML');

    const element = this._DOMParse(html);
    element.querySelectorAll('*')
      .forEach(el => {
        if (el.tagName.toLowerCase() === 'svg')
          el.remove();
        this._sanitizeElement(el, true);

        el.removeAttribute(ELEMENT_OUT_OF_VIEW_ATTR);
      });

    return this._formatHtml(element.documentElement.outerHTML);
  }

  async getVisibleHtml(): Promise<string> {
    await this.updatePage();

    const document = await this._getDOM();
    // order matters! 
    document.querySelectorAll('*')
      .forEach(el => {
        this._makeParentFromSingleChild(el);
        this._removeInvisible(el);
        this._sanitizeElement(el);
      });

    // remove unwanted elements
    document.querySelectorAll('script, style, svg')
      .forEach(el => el.remove());

    // remove all head elements except page title
    document.head.querySelectorAll('*')
      .forEach(headEl => {
        if (headEl.tagName.toLowerCase() !== 'title')
          headEl.remove();
      });

    const html = await this._formatHtml(document.documentElement.outerHTML);
    return html;
  }

  async getTitle(): Promise<string> {
    return this.browser.driver.executeScript<string>(() => document.title);
  }

  async getSize(): Promise<{ height: number, width: number; }> {
    return this.browser.driver.executeScript<{ height: number, width: number; }>(() => {
      const height = document.querySelector('body').scrollHeight;
      const width = document.querySelector('body').scrollWidth;

      return {
        height,
        width
      };
    });
  }

  async updatePage(): Promise<void> {
    await this._setElementsVisibility();
    await this._setSelectorsMapping();
  }

  //** Gets the selector for an element relative to some parent container */
  async getChildRelativeSelector(parentSelector: string, childSelector: string): Promise<string> {
    const parent = await this.getElementHtml(parentSelector);
    const dom = this._DOMParse(parent);

    const childSelectorSplit = childSelector.split(' > ');
    let child: globalThis.Element;
    while (childSelectorSplit.length || !child) {
      child = dom.querySelector(childSelectorSplit.join(' > '));

      if (child) break;
      childSelectorSplit.shift();
    }

    if (!child) throw new Error("Couldn't find child element");
    return this._getElementSelector(child, false);
  }

  // ---------- PRIVATE METHODS --------- //
  private _DOMParse(html: string): Document {
    return new JSDOM(html, {
      contentType: 'text/html',
      virtualConsole: new VirtualConsole()
    }).window.document;
  }

  /** Gets a COPY of the current dom */
  private async _getDOM(): Promise<Document> {
    const html = await this.browser.driver.getPageSource();
    return this._DOMParse(html);
  }

  private _getElementSelector(element: globalThis.Element, useId = true): string {
    if (element.tagName.toLowerCase() === 'body') return 'body';
    const names = [];
    while (element.parentElement && element.tagName.toLowerCase() !== 'body') {
      if (element.id && useId) {
        names.unshift('#' + element.getAttribute('id'));
        break;
      } else {
        const siblings = Array.from(element.parentElement.children);
        if (siblings.filter(el => el.tagName === element.tagName).length > 1) {
          let c = 1, e = element;
          for (; e.previousElementSibling; e = e.previousElementSibling, c++);
          names.unshift(element.tagName.toLowerCase() + ':nth-child(' + c + ')');
        } else {
          names.unshift(element.tagName.toLowerCase());
        }
      }
      element = element.parentElement;
    }
    return names.join(' > ');
  }

  private _sanitizeElement(element: globalThis.Element, removeInternalId = false): void {
    const validAttrs = [
      "id",
      "alt",
      "href",
      "disabled",
      "placeholder",
      "aria-placeholder",
      "label",
      "aria-label",
      "value",
      "checked",
      "readonly",
      "required"
    ];

    const attributesToRemove = [];

    function mustKeepAttr(attrName: string) {
      const attrIsInList = validAttrs.includes(attrName);
      const attrIsAnListItemAlternative = validAttrs.includes(attrName.replace('data-', ''));
      const isInternalIdAndMustNotRemove = attrName === INTERNAL_ELEMENT_ID && !removeInternalId;

      return attrIsInList || attrIsAnListItemAlternative || isInternalIdAndMustNotRemove;
    }

    for (let i = 0; i < element.attributes.length; i++) {
      const attributeName = element.attributes[i].name;
      const attributeIsEmpty = !element.attributes[i].value;

      if (!mustKeepAttr(attributeName) || attributeIsEmpty)
        attributesToRemove.push(attributeName);
    }

    for (const attributeName of attributesToRemove) {
      element.removeAttribute(attributeName);
    }
  }

  private _removeInvisible(element: globalThis.Element): void {
    if (element.hasAttribute(ELEMENT_OUT_OF_VIEW_ATTR))
      element.remove();
  }

  private _makeParentFromSingleChild(element: globalThis.Element): void {
    if (
      element.tagName.toLowerCase() === 'div' &&
      element.children.length === 1 &&
      element.children[0].tagName.toLowerCase() === 'div') {

      const text = element.textContent.toString();
      element.replaceWith(element.children[0]);
      element.textContent = text;

    } else {
      for (let i = 0; i < element.children.length; i++) {
        this._makeParentFromSingleChild(element.children[i]);
      }
    }
  }

  private async _formatHtml(html: string): Promise<string> {
    const sanitized = html
      .replace(/<!--[\s\S]*?-->/g, '') // removes comments
      .replace(/^\s*[\r\n]/gm, ''); // removes empty lines

    return prettier.format(sanitized, {
      parser: 'html',
      tabWidth: 2,
      useTabs: false,
      printWidth: 3000,
      bracketSpacing: false
    });
  }

  /** Sets visibility attribute for the elements */
  private async _setElementsVisibility(): Promise<void> {
    await this.browser.driver.executeScript<string>((elOutOfViewAttrName: string) => {
      // IMPORTANT! remove out of view attribute 
      document.querySelectorAll('body *')
        .forEach(element => element.removeAttribute(elOutOfViewAttrName));

      document.querySelectorAll('body *').forEach((element) => {
        if (!isInViewPort(element) || !element.checkVisibility())
          element.setAttribute(elOutOfViewAttrName, 'true');
      });

      // prevent making parent of visible elements invisible (for some specific cases)
      document.querySelectorAll('body *').forEach(makeParentVisibleIfSomeChildIs);

      function makeParentVisibleIfSomeChildIs(element) {
        const elementTree = element.querySelectorAll('*');
        const elementOffspring = Array.from(elementTree || []);

        if (elementOffspring.some((el: globalThis.Element) => !el.hasAttribute(elOutOfViewAttrName)))
          element.removeAttribute(elOutOfViewAttrName);
      }
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
    }, ELEMENT_OUT_OF_VIEW_ATTR);
  }

  /** Sets the id based mapping for selectors */
  private async _setSelectorsMapping(): Promise<void> {
    this._selectorsMapping =
      await this.browser.driver.executeScript<Record<string, string>>
        ((internalId: string, elOutOfViewAttrName: string, unwantedElements: string[]) => {
          const selectorsMapping = {};

          document.querySelectorAll('body *').forEach((el, i) => {
            el.setAttribute(internalId, i.toString());
            const isOutOfView = el.getAttribute(elOutOfViewAttrName);

            if (!isOutOfView && !unwantedElements.includes(el.tagName.toLowerCase()))
              selectorsMapping[i] = getSelector(el);
          });

          return selectorsMapping;

          function getSelector(element: globalThis.Element) {
            if (element.tagName.toLowerCase() === 'body') return 'body';
            const names = [];
            while (element.parentElement && element.tagName.toLowerCase() !== 'body') {
              if (element.id) {
                names.unshift('#' + element.getAttribute('id'));
                break;
              } else {
                const siblings = Array.from(element.parentElement.children);
                if (siblings.filter(el => el.tagName === element.tagName).length > 1) {
                  let c = 1, e = element;
                  for (; e.previousElementSibling; e = e.previousElementSibling, c++);
                  names.unshift(element.tagName.toLowerCase() + ':nth-child(' + c + ')');
                } else {
                  names.unshift(element.tagName.toLowerCase());
                }
              }
              element = element.parentElement;
            }
            return names.join(' > ');
          }
        }, INTERNAL_ELEMENT_ID, ELEMENT_OUT_OF_VIEW_ATTR, UNWANTED_ELEMENTS);
  }
}
