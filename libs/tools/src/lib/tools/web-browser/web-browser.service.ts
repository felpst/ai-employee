import { IWebBrowser } from '@cognum/interfaces';
import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { By, until } from 'selenium-webdriver';
import { IElementFindOptions } from './common/element-schema';
import { ExtractDataUseCase } from './usecases/extract-data.usecase';
import { FindElementUseCase } from './usecases/find-element.usecase';

import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { LLMChainExtractor } from 'langchain/retrievers/document_compressors/chain_extract';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { WebBrowserElement } from './models/web-browser-element.model';
import WebBrowserUtils from './web-browser-utils';

export class WebBrowserService {
  currentURL: string;
  retriever: ContextualCompressionRetriever;

  constructor(private webBrowser: IWebBrowser) {}

  async checkCurrentURLUpdated() {
    await this.webBrowser.driver.sleep(5000);
    const currentURL = await this.webBrowser.driver.getCurrentUrl();
    if (this.currentURL === currentURL) return false;
    this.currentURL = currentURL;
    this.retriever = null;
    return true;
  }

  async loadPage(url: string): Promise<boolean> {
    this.webBrowser.driver.get(url);
    await this.webBrowser.driver.sleep(500);
    for (let i = 0; i < 3; i++) {
      console.log(`Waiting for page load: ${url}`);
      const currentUrl = await this.webBrowser.driver.getCurrentUrl();
      if (currentUrl.includes(url)) {
        await this.checkCurrentURLUpdated();
        return true;
      }
    }
    return false;
  }

  async click(options: IElementFindOptions) {
    const element = await this.webBrowser.driver.wait(
      until.elementLocated(By[options.selectorType](options.elementSelector)),
      options.findTimeout
    );

    if (!element) return false;
    await element.click();
    await this.checkCurrentURLUpdated();
    return true;
  }

  async inspectElement(idOrClass: string): Promise<any> {
    try {
      let element;
      if (idOrClass.startsWith('.')) {
        element = await this.webBrowser.driver.findElement({ css: idOrClass });
      } else {
        element = await this.webBrowser.driver.findElement({ id: idOrClass });
      }

      const attributes = await this.webBrowser.driver.executeScript(
        'let items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;',
        element
      );

      const html = await element.getAttribute('outerHTML');

      return { html, attributes };
    } catch (e) {
      console.error(e);
      return { html: '', attributes: { id: '', class: '', xpath: '' } };
    }
  }

  async inputText(
    text: string,
    options: IElementFindOptions
  ): Promise<boolean> {
    const userInput = await this._findElement(options);

    if (!userInput) return false;
    await userInput.sendKeys(text);

    return true;
  }

  async clickElement(options: IElementFindOptions): Promise<boolean> {
    const element = await this._findElement(options);

    if (!element) return false;
    await element.click();

    return true;
  }

  async findElementByContext(context: string): Promise<any> {
    // Load
    console.log({ pageURL: this.currentURL, context });

    const element = await WebBrowserElement.findOne({
      pageURL: this.currentURL,
      context,
    }).exec();
    console.log(element);

    // TODO force
    if (element) {
      return element;
    }

    await this.prepareVectorBase();
    const useCase = new FindElementUseCase(this.webBrowser);
    const relevantContext = await this.retrieveRelevantContext(context);
    const result = await useCase.findElementByContext(context, relevantContext);

    if (!result.found) {
      throw new Error(
        `Element not found for context: ${{
          pageURL: this.currentURL,
          context,
        }}`
      );
    }

    // Save element
    await WebBrowserElement.deleteMany({
      pageURL: this.currentURL,
      context,
    }).exec();
    if (result.found) {
      const newElement = await WebBrowserElement.create({
        pageURL: this.currentURL,
        context,
        selector: result.selector,
        selectorType: result.selectorType,
      });
      console.log({ newElement });
    }

    return result;
  }

  async prepareVectorBase() {
    if (this.retriever) return;
    console.log('prepareVectorBase...');

    const source = await this.getPageSource();
    // console.log(source);
    if (!source) throw new Error('Error getting page source');

    // fazer o loader para docs
    const model = new ChatModel();
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    // const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
    // const docs = await textSplitter.createDocuments([source]);
    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html', {
      chunkSize: 2000,
      chunkOverlap: 20,
    });
    const docs = await splitter.createDocuments([source]);
    console.log('docs lenght:', docs.length);

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new EmbeddingsModel()
    );
    console.log('vectorStory ready');

    this.retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever({ searchType: 'similarity' }),
    });
  }

  async retrieveRelevantContext(context: string): Promise<any> {
    const retrievedDocs = await this.retriever.getRelevantDocuments(
      `Task: You need to identify the original element in the html page source code using the context.
      Context: ${context}`
    );

    if (!retrievedDocs.length) throw new Error('Error retrieving relevant context');

    console.log({ retrievedDocs });
    return retrievedDocs.map((doc) => doc.pageContent).join('\n');
  }

  async getPageSource(): Promise<string> {
    const webBrowserUtils = new WebBrowserUtils(this.webBrowser);
    const source = await webBrowserUtils.getHtmlFromElement('body');
    return source;
  }

  async findElementByContextBkp(context: string): Promise<any> {
    const element = await new FindElementUseCase(this.webBrowser).execute(context);
    return element;
  }

  async scrollPage(
    scrollTo: number,
    direction: 'Vertical' | 'Horizontal',
    options: IElementFindOptions | null = null
  ): Promise<boolean> {
    const MAX_ITERATIONS = 5;
    const TIME_BETWEEN_ITERATIONS = 1500;

    let elementReference = null;
    let targetLocation = scrollTo;

    // If options is provided, gets the element reference and relative position
    if (options) {
      elementReference = await this._findElement(options);
      if (!elementReference) return false;
      targetLocation = Number(await elementReference.getAttribute('offsetTop'));
    }
    const firstScroll = `window.scrollTo(0, ${targetLocation});`;

    const { locationScript, updateScrollScript } = await this._getScrollScripts(
      targetLocation,
      direction,
      elementReference
    );

    // Performs the first scroll to the desired position
    await this.webBrowser.driver.executeScript(firstScroll);
    await this.webBrowser.driver.sleep(500);

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // Gets the current position
      const currentLocation = Number(
        await this.webBrowser.driver.executeScript(
          locationScript,
          elementReference
        )
      );

      // Checks whether the current position has reached or exceeded the desired position
      if (currentLocation >= scrollTo) {
        return true;
      }

      // Scroll from the current position to the desired position
      await this.webBrowser.driver.executeScript(
        updateScrollScript,
        elementReference
      );

      // Waits the specified time between iterations
      await this.webBrowser.driver.sleep(TIME_BETWEEN_ITERATIONS);
    }

    return false;
  }

  async extractData(findOptions: IElementFindOptions) {
    return new ExtractDataUseCase(this.webBrowser).execute(findOptions);
  }

  async keyupEmiter(key: string, combination?: string[]): Promise<string> {
    if (combination) {
      combination.map(async k => await this.webBrowser.driver.actions().keyDown(k).perform());
      return await this.webBrowser.driver.actions().keyDown(key).perform().then(
          async () => {
            await this.webBrowser.driver.actions().keyUp(key).perform();
            combination.map(async k => await this.webBrowser.driver.actions().keyUp(k).perform());
            await this.checkCurrentURLUpdated()
            return `Keys ${key}, ${combination.join(',')} pressed`;
          },
          (error) => {
            return error.message;
          }
        );
    } else {
      return await this.webBrowser.driver.actions().keyDown(key).perform().then(
          async () => {
            await this.webBrowser.driver.actions().keyUp(key).perform();
            await this.checkCurrentURLUpdated()
            return `Key ${key} pressed`;
          },
          (error) => {
            return error.message;
          }
        );
    }
  }

  private async _findElement(findOptions: IElementFindOptions) {
    return this.webBrowser.driver.wait(
      until.elementLocated(By[findOptions.selectorType](findOptions.elementSelector)),
      findOptions.findTimeout
    );
  }

  private async _getScrollScripts(
    scrollTo: number,
    direction: 'Vertical' | 'Horizontal',
    input: any | null = null
  ) {
    let locationScript: string;
    let updateScrollScript: string;

    if (!input) {
      // If there is no input element, the scroll will be on the full page
      locationScript =
        direction === 'Vertical'
          ? 'return window.scrollY;'
          : 'return window.scrollX;';
      updateScrollScript = `window.scrollTo(${
        direction === 'Vertical' ? 0 : scrollTo
      }, ${direction === 'Horizontal' ? 0 : scrollTo});`;
    } else {
      // If there is an input element, the scroll will be on the specific element
      const elementScrollAttribute =
        direction === 'Vertical' ? 'scrollHeight' : 'scrollWidth';
      locationScript = `return arguments[0].${elementScrollAttribute};`;
      updateScrollScript = `arguments[0].scrollTo(${
        direction === 'Horizontal' ? scrollTo : 0
      }, ${direction === 'Vertical' ? scrollTo : 0});`;
    }
    return { locationScript, updateScrollScript };
  }
}
