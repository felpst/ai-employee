import { BrowserType } from './drivers/Search.driver';
import { StartUseCase } from './usecases/start.usecase';
import { CloseUseCase } from './usecases/close.usecase';
import { SearchApiResult } from './internet-research.interface';
import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { WebBrowser } from '@cognum/browser';

export class SummarizationService {
  webBrowser: WebBrowser;

  async start(browser: BrowserType = 'chrome') {
    this.webBrowser = await new StartUseCase().execute(browser);
  }

  async stop() {
    await new CloseUseCase(this.webBrowser).execute();
  }

  async summarize(search: SearchApiResult[], input: string): Promise<string> {
    const sourceResults = [];

    for (const result of search) {
      await this.webBrowser.loadUrl({ url: result.url });
      const source = await this.webBrowser.driver.getPageSource();
      if (!source) throw new Error('Error getting page source');

      sourceResults.push(source);
    }

    const model = new ChatModel();
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments(sourceResults);

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new EmbeddingsModel());

    const retriever = new ContextualCompressionRetriever({
      baseCompressor: baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const questions = await model.invoke(`Break the following question into 10 smaller questions:\n${input}\n`);

    const questionsArr = questions.content.toString().split('\n');

    console.log(questionsArr);

    let retrievedDocs = [];

    for (const question of questionsArr) {

      const retrievedDoc = await retriever.getRelevantDocuments(question);
      console.log('doc', retrievedDocs);
      retrievedDoc.map(doc => { retrievedDocs.push(doc.pageContent.toString()); });
    }
    console.log('docs', retrievedDocs);

    const ansewer = await model.invoke(`Sumarize the following topics into an article:\n${retrievedDocs}\n`);

    return ansewer.content.toString();
  }
}
