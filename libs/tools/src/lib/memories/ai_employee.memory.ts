import { IChat, IMessage, IUser } from '@cognum/interfaces';
import { ChatModel } from '@cognum/llm';
import { Message } from '@cognum/models';
import { Callbacks } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain/prompts';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { AIEmployeeVectorStore } from '../vectorstores/ai_employee.vectorstore';

export interface Message {
  content: string;
  role: string;
}

export class AIEmployeeMemory {
  chat: IChat;
  user: IUser;
  messages: IMessage[] = [];
  vectorStore: AIEmployeeVectorStore;

  constructor(data: { chat?: IChat; user: IUser }) {
    this.chat = data.chat;
    this.user = data.user;
    this.vectorStore = new AIEmployeeVectorStore({
      directoryPath: `${this.chat._id}`,
    });
  }

  async addMessage(message: Partial<IMessage>) {

    message.chat = this.chat._id;
    message.createdBy = this.user._id;
    message.updatedBy = this.user._id;

    const docMessage = await Message.create(message);
    console.log(docMessage)
    this.messages.push(docMessage);

    // Generate summary and vector store every 10 messages
    if (this.messages.length % 10 === 0) {
      this.generateSummary();
    }

    return docMessage;
  }

  async chatName(callbacks?: Callbacks | any) {
    if (this.chat.name !== 'New chat') return;

    try {
      const model = new ChatModel({
        callbacks: [
          {
            handleLLMNewToken: callbacks.handleLLMNewTokenChatName,
          },
        ],
      });
      const prompt = PromptTemplate.fromTemplate(
        `Create a short name of chat conversation. The first message is: ${this.messages[0].content}. Response: ${this.messages[1].content}. Chat name: `
      );
      const chain = new LLMChain({ llm: model, prompt });
      const res = await chain.run({});
      this.chat.name = res.trim();
      await this.chat.save();
    } catch (error) {
      console.log('[chatName error]', error);
    }
  }

  async loadAllMessages() {
    this.messages = await Message.find({ chat: this.chat._id }, null, {
      sort: { createdAt: 1 },
    });
    if (this.messages.length < 10) return;
    await this.loadVectorStore();
  }

  private splitTextIntoSentencesAndParagraphs(text: string): string[] {
    if (!text) return [];
    const regex = /(?<=[.!?])\s+(?=[A-Z])|(?<=\w)\.\s+(?=[A-Z])|\n\s*\n/g;
    return text.split(regex);
  }

  async loadVectorStore() {
    try {
      await this.vectorStore.load();
    } catch (error) {
      const docs = this.splitTextIntoSentencesAndParagraphs(
        this.chat.summary
      ).map((content) => {
        return new Document({
          pageContent: content,
        });
      });
      await this.vectorStore.addDocuments(docs);
    }
  }

  getLastMessages(numberOfMessages = 10) {
    return this.messages.slice(-numberOfMessages);
  }

  async generateSummary() {
    if (this.messages.length < 10) return;

    // Generate summary
    const model = new ChatModel();
    const prompt =
      PromptTemplate.fromTemplate(`Summarize the conversation below in just a sentence or two, using the entire conversation history, without losing information. Be objective and direct. Do not add irrelevant messages. You need to keep all the data and information in the summary.

      All Conversation:
      {chat_conversation}

      Conversation Summary: `);
    const chain = new LLMChain({ llm: model, prompt });

    const chat_conversation = this.messages
      .splice(-10)
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    // The result is an object with a `text` property.
    const response = await chain.call({
      chat_conversation,
    });
    const summary = response.text;

    // Save on chat
    this.chat.summary = `${
      this.chat.summary ? this.chat.summary + '\n' : ''
    }${summary}`;
    await this.chat.save();

    // Save on vector store
    await this.vectorStore.addDocuments(
      this.splitTextIntoSentencesAndParagraphs(summary).map(
        (content: string) => {
          return new Document({ pageContent: content });
        }
      )
    );

    return summary;
  }

  async queryMemory(query: string) {
    const attributeInfo: AttributeInfo[] = [
      {
        name: '_id',
        description: 'Id of the message in the database',
        type: 'string',
      },
      {
        name: 'role',
        description: 'Role of the message (AI or HUMAN)',
        type: 'string',
      },
      {
        name: 'createdAt',
        description: 'Date of the message creation',
        type: 'Date',
      },
    ];

    const retriever = this.vectorStore.getRetriever(
      attributeInfo,
      'Interactions with Human or AI'
    );
    const docs = await retriever.getRelevantDocuments(query, {});
    console.log('queryMemory', docs);

    return docs;
  }
}
