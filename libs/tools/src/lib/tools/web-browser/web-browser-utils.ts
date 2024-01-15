import { IWebBrowser } from '@cognum/interfaces';
import { JSDOM } from 'jsdom';
import prettier from 'prettier';

const ELEMENT_OUT_OF_VIEW_ATTR = 'is-out-of-view';
const INTERNAL_ELEMENT_ID = 'selector-id';

export default class WebBrowserUtils {
  constructor(protected webBrowser: IWebBrowser) { }

  async getElementHtmlBySelector(selector: string): Promise<string> {
    const dom = this._getDomFromStringHTML(await this.getHtml(false));
    const element = dom.querySelector(selector);

    element.querySelectorAll('*')
      .forEach(el => {
        if (el.tagName.toLowerCase() === 'svg')
          el.remove();
        this._sanitizeElement(el, true);
      });

    return this._formatHtml(element.outerHTML);
  }

  /** Gets page html and sets visibility attribute
   *  @returns {string}
   */
  async getHtml(setAttributes = true): Promise<string> {
    return this.webBrowser.driver.executeScript((setAttributes: boolean, elOutOfViewAttrName: string) => {
      // IMPORTANT! remove out of view attribute 
      document.querySelectorAll('body *').forEach(element => element.removeAttribute(elOutOfViewAttrName));

      if (setAttributes) {
        document.querySelectorAll('body *').forEach((element) => {
          if (!isInViewPort(element) || !element.checkVisibility())
            element.setAttribute(elOutOfViewAttrName, 'true');
        });

        // prevent making parent of visible elements invisible (for some specific cases)
        document.querySelectorAll('body *').forEach(makeParentVisibleIfSomeChildIs);
      }

      return document.documentElement.outerHTML;

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
    }, setAttributes, ELEMENT_OUT_OF_VIEW_ATTR, INTERNAL_ELEMENT_ID);
  }

  async getVisibleHtmlAndSelectors(): Promise<{ html: string, selectors: Record<string, string>; }> {
    const stringHTML = await this.getHtml();
    const document = this._getDomFromStringHTML(stringHTML);
    const selectors = {};

    // create internal ids and get selectors from when still full html
    document.querySelectorAll('*:not(script):not(style):not(svg)').forEach((el, i) => {
      el.setAttribute(INTERNAL_ELEMENT_ID, i.toString());
      const isOutOfView = el.getAttribute(ELEMENT_OUT_OF_VIEW_ATTR);

      if (!isOutOfView)
        selectors[i] = this._getElementSelector(el);
    });

    // (order matters!) replace parent for child when single child, remove elements outside viewport and cleanup unwanted attributes from element 
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
    return { html, selectors };
  }

  private _getDomFromStringHTML(html: string) {
    return new JSDOM(html, { contentType: 'text/html' }).window.document;
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

  private _sanitizeElement(element: globalThis.Element, removeInternalId = false) {
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

  private _removeInvisible(element: globalThis.Element) {
    if (element.hasAttribute(ELEMENT_OUT_OF_VIEW_ATTR))
      element.remove();
  }

  private _makeParentFromSingleChild(element: globalThis.Element) {
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

  private async _formatHtml(html: string) {
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
}
