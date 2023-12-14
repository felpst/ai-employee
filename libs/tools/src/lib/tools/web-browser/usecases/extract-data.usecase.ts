import { ChatModel } from '@cognum/llm';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from 'langchain/schema/runnable';
import { By, until } from 'selenium-webdriver';
import { z } from 'zod';
import { WebBrowser } from "../web-browser";
import WebBrowserUtils from '../web-browser-utils';
import { IElementFindOptions } from '../web-browser.service';

export class ExtractDataUseCase extends WebBrowserUtils {
  constructor(
    protected webBrowser: WebBrowser
  ) {
    super(webBrowser);
  }

  async execute(findOptions: IElementFindOptions) {
    await this.webBrowser.driver.wait(
      until.elementLocated(By[findOptions.selectorType](findOptions.fieldSelector)),
      findOptions.findTimeout
    );
    const htmlContent = await this.getHtmlFromElement(findOptions.fieldSelector, findOptions.selectorType);

    const data = await this.getDataFromHTML(htmlContent);
    return data;
  }

  async getDataFromHTML(content: string) {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        result: z.any().describe("Data in json format. Must be an object or array.")
      })
    );

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `Task: You need extract the data from the html input and convert it to json.
        Source Code:
        \`\`\`html
        {content}
        \`\`\`

        {parser}`
      ),
      new ChatModel(),
      parser,
    ]);

    const response = await chain.invoke({
      content,
      parser: parser.getFormatInstructions(),
    });

    if (!response.result) {
      const error = new Error('Error trying to get data from HTML.');
      console.error(error, response);
      throw error;
    }
    return response.result;
  }
}
