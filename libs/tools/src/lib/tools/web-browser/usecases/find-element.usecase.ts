import { ChatModel } from "@cognum/llm";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from "zod";
import { WebBrowser } from "../web-browser";

export class FindElementUseCase {
  constructor(
    private webBrowser: WebBrowser
  ) { }

  async execute(context: string) {
    // Pegar o código fonte do body
    // const source = await this.webBrowser.driver.executeScript("return document.body.innerHTML") as string;
    const source = await this.getAllBodyElements()

    // Usar o LLM para identificar o elemento
    const result = await this.findElementByContext(context, source);
    console.log(result);

    // Retornar o elemento
    return result
  }

  async getAllBodyElements() {
    try {
      // TODO ideas: tirar atributos inuteis (eventos, name), remover elementos improvaveis

      // Execute o script para clonar o conteúdo do body e remover scripts e styles
      let bodyContent = await this.webBrowser.driver.executeScript(`
          // Clona o elemento body
          var bodyClone = document.body.cloneNode(true);

          // Remove todos os elementos <script> e <style> do clone
          Array.from(bodyClone.getElementsByTagName('script')).forEach(el => el.remove());
          Array.from(bodyClone.getElementsByTagName('style')).forEach(el => el.remove());
          Array.from(bodyClone.getElementsByTagName('svg')).forEach(el => el.remove());
          Array.from(bodyClone.getElementsByTagName('hr')).forEach(el => el.remove());

          //var elements = bodyClone.querySelectorAll('[jsaction]');
          //elements.forEach(element => element.removeAttribute('jsaction'));

          return bodyClone.innerHTML;
      `);
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

    if (response.selectorType === 'id') {
      response.selector = response.selector.replace('#', '')
    }

    return response
  }
}
