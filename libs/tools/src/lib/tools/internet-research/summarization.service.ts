import { ChatModel, EmbeddingsModel } from '@cognum/llm';
import { loadSummarizationChain } from "langchain/chains";
import { SearchApiLoader } from "langchain/document_loaders/web/searchapi";
import { PromptTemplate } from "langchain/prompts";
import { TokenTextSplitter } from "langchain/text_splitter";
import { WebBrowser } from "../web-browser/web-browser";
import { WebBrowserService } from '../web-browser';
import { BrowserType } from './drivers/Search.driver'
import { StartUseCase } from './usecases/start.usecase';
import { CloseUseCase } from './usecases/close.usecase';
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { SearchApiResult } from './internet-research.interface';

export class SummarizationService {
  webBrowser: WebBrowser

  async start(browser: BrowserType = 'chrome') {
    this.webBrowser = await new StartUseCase().execute(browser)
  }

  async stop() {
    await new CloseUseCase(this.webBrowser).execute()
  }

  async summarize(search: SearchApiResult): Promise<string> {
    console.log(search)
    const webBrowserService = new WebBrowserService(this.webBrowser)

    await webBrowserService.loadPage(search.url)
    //await webBrowserService.prepareVectorBase()
    let retriever: ContextualCompressionRetriever
    
    if (retriever) return;
    console.log('prepareVectorBase...');

    const source = await webBrowserService.getPageSource();
    if (!source) throw new Error('Error getting page source');

    const model = new ChatModel();
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
      chunkSize: 2000,
      chunkOverlap: 20,
    });
    const docs = await splitter.createDocuments([source]);
    console.log('docs lenght:', docs.length);

    const vectorStore = await HNSWLib.fromDocuments(docs, new EmbeddingsModel());
    console.log('vectorStory ready');

    retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever({searchType: 'similarity'}),
    });

    /*

    const loader = new SearchApiLoader({
      engine: "youtube_transcripts",
      video_id: "WTOm65IZneg",
      apiKey: "XYhVu5R2SqSQy99DphBtGVe6"
    });

    

    const docs = await loader.load();

    const splitter = new TokenTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 250,
    });
    */

    const docsSummary = await splitter.splitDocuments(docs);

    const llmSummary = new ChatModel();

    const articleTemplate = `
    You are an expert in to get article content from HTML based in context.
    Your goal is to get article content from HTML and ignore HTML.
    Below you will find a transcript of an HTML:
    --------
    {text}
    --------
    
    The article transcription will also be used as the basis for a HTML interpretation bot.
    Separate the content article from HTML based on context: ${search.title}. Extract all information about the article.
    
    The total output will be a article.
    
    ARTICLE:
    `;

    const ARTICLE_PROMPT = PromptTemplate.fromTemplate(articleTemplate);

    const summaryTemplate = `
    You are an expert in to get article content from HTML and summarizing an article.
    Your goal is to get article content from HTML and create a summary of an article.
    Below you will find a transcript of an HTML:
    --------
    {text}
    --------
    
    The article transcription will also be used as the basis for a HTML interpretation bot.
    Separate the content article from HTML and extract most important information from the article into topics. Make very detailed and specific topics.
    
    The total output will be a summary of the article and a list of article topics.
    
    SUMMARY AND TOPICS:
    `;

    const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

    const summarizeChain = loadSummarizationChain(llmSummary, {
      type: "refine",
      verbose: true,
      questionPrompt: ARTICLE_PROMPT,
      refinePrompt: SUMMARY_PROMPT,
    });

    const summary = await summarizeChain.run(docsSummary);

    return summary;
  }
}
