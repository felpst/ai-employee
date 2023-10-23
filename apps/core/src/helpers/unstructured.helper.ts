import { OpenAI, OpenAIEmbeddings } from '@cognum/llm/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

export class Unstructured {
  async loader() {
    const options = {
      apiKey: '***REMOVED***',
    };

    const loader = new UnstructuredLoader('linecker.html', options);
    // const loader = new UnstructuredLoader('teste.md', options);
    // const loader = new UnstructuredLoader('customers.csv', options);
    // const loader = new UnstructuredLoader('ebook-dados.pdf', options);
    console.log('Loading...');
    const docs = await loader.load();
    console.log('X');

    console.log(docs);
    console.log(docs.length);

    if (!docs.length) return;

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );

    // Initialize a retriever wrapper around the vector store
    const vectorStoreRetriever = vectorStore.asRetriever();

    // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
    const model = new OpenAI();
    const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
    const res = await chain.call({
      query: 'List all informations about this profile',
    });
    console.log({ res });
  }
}
