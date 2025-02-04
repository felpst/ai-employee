import { IWebBrowser } from "@cognum/interfaces";
import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import WebBrowserUtils from '../web-browser-utils';

export class FindElementUseCase extends WebBrowserUtils {
  constructor(
    protected webBrowser: IWebBrowser
  ) {
    super(webBrowser);
  }

  async execute(context: string) {
    // Pegar o código fonte do body
    // const source = await this.webBrowser.driver.executeScript("return document.body.innerHTML") as string;
    const source = await this.getAllBodyElements();

    // Usar o LLM para identificar o elemento
    const result = await this.findElementByContext(context, source);
    console.log(result);

    // Retornar o elemento
    return result;
  }

  async getAllBodyElements() {
    try {
      let bodyContent = await this.getHtmlFromElement('body');
      return bodyContent as string;
    } catch (error) {
      throw new Error(`Error getting body content: ${error.message}`);
    }
  }

  async findElementByContext(context: string, source: string): Promise<any> {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        selector: z.string().describe("element selector found on source page for Selenium Web Driver."),
        selectorType: z.enum(['id', 'name', 'xpath', 'css', 'js', 'linkText', 'partialLinkText']).describe("type of the selector for Selenium Web Driver."),
        found: z.boolean().describe("true if the element was found, false otherwise."),
      })
    );

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: You need to identify the original element in the html page source code using the context. Never convert textarea to input. Always preserve original tag and attributes.
        Context: {context}
        Source Page:
        \`\`\`html
        {source}
        \`\`\`

        {format_instructions}`
      ),
      new ChatModel(),
      parser,
    ]);

    // console.log(parser.getFormatInstructions());

    const response = await chain.invoke({
      context,
      source,
      format_instructions: parser.getFormatInstructions(),
    });



    // if (response.selector.startsWith('#') && response.selector.includes('.')) {
    //   response.selectorType = 'css';
    // }
    if (response.selectorType === 'id') {
      response.selector = response.selector.replace('#', '');
    }

    return response;
  }

  async chooseLikelySelector(context: string, selectors: string[]): Promise<any> {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        selectorIndex: z.number().describe("choosen selector index from the list."),
        found: z.boolean().describe("true if the selector matches the context, false otherwise."),
      })
    );

    const enumeratedSelectorsList = selectors
      .sort()
      .map((selector, index) => `${index + 1} - ${selector}`)
      .join('\n');

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: You need to identify the most likely xpath selector for an element in an html page source code using the context.
        Context: {context}
        Possible selector options:
        \`\`\`txt
        {list}
        \`\`\`

        {format_instructions}`
      ),
      new ChatModel({ maxTokens: 50 }),
      parser,
    ]);

    const result = await chain.invoke({
      context,
      list: enumeratedSelectorsList,
      format_instructions: parser.getFormatInstructions()
    });

    if (!result.found) {
      throw new Error(`Element not found for context: "${context}"`);
    }

    return {
      selector: selectors.sort()[result.selectorIndex - 1],
      selectorType: 'xpath',
    };
  }

  async chooseLikelySelectorToExtract(context: string, selectors: any[]): Promise<any> {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        selectorIndex: z.number().describe("choosen selector index from the list."),
        found: z.boolean().describe("true if the selector matches the context, false otherwise."),
      })
    );

    const enumeratedSelectorsList = selectors
      .sort()
      .map((selector, index) => `${index + 1} - ${selector}`)
      .join('\n');

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: You need to identify the most likely selector for an element in an html page source code using the context.
        Context: {context}
        Possible selector options:
        \`\`\`txt
        {list}
        \`\`\`

        {format_instructions}`
      ),
      new ChatModel({ maxTokens: 50 }),
      parser,
    ]);

    const result = await chain.invoke({
      context,
      list: enumeratedSelectorsList,
      format_instructions: parser.getFormatInstructions()
    });

    if (!result.found) {
      throw new Error(`Element not found for context: "${context}"`);
    }

    return {
      selector: selectors.sort()[result.selectorIndex - 1],
      selectorType: 'css',
    };
  }
}
