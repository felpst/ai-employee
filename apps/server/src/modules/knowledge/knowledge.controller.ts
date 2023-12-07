import { IKnowledge } from '@cognum/interfaces';
import KnowledgeBase, { KnowledgeMetadata } from '@cognum/knowledge-base';
import { ChatModel } from '@cognum/llm';
import { Knowledge } from '@cognum/models';
import { KnowledgeRetrieverService } from '@cognum/tools';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { LLMChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain/prompts';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import ModelController from '../../controllers/model.controller';

export class KnowledgeController extends ModelController<typeof Knowledge> {
  constructor() {
    super(Knowledge);
    this.addOpenAIFile = this.addOpenAIFile.bind(this);
    this.replaceOpenAIFile = this.replaceOpenAIFile.bind(this);
  }

  private async _generateTitle(data: string) {
    try {
      const model = new ChatModel({
        temperature: 0
      });
      const prompt = PromptTemplate.fromTemplate(
        `Create a short title that summarizes the text. The text is: ${data}. Text title: `
      );
      const chain = new LLMChain({ llm: model, prompt });
      const res = await chain.run({});
      return res.trim().replace(/[\n"]/g, '');
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  private async _generateSummary(data: string) {
    try {
      const model = new ChatModel({
        temperature: 0
      });
      const prompt = PromptTemplate.fromTemplate(
        `Create a summary that summarizes the entire idea brought up in the text. The text is: ${data}. Text summary: `
      );
      const chain = new LLMChain({ llm: model, prompt });
      const res = await chain.run({});
      return res.trim().replace(/[\n"]/g, '');
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  private _textToFilename(text: string, ext?: string): string {
    const invalidCharsRegex = /[/\\?%*:|"<>]/g;
    return text.replace(invalidCharsRegex, '_') + `${ext ? `.${ext}` : ''}`;
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req['userId'];
      const _knowledges = Array.isArray(req.body) ? [...req.body] : [req.body];
      const docs = [];
      for (const knowledge of _knowledges) {
        const { title, description, permissions, ...rest } = knowledge;
        const _title = title || (await this._generateTitle(rest.data));
        const _description =
          description || (await this._generateSummary(rest.data));
        const _permissions = permissions || [
          {
            userId: userId,
            permission: 'Editor',
          },
        ];
        const doc = await Knowledge.create({
          ...rest,
          createdBy: userId,
          updatedBy: userId,
          title: _title,
          description: _description,
          permissions: _permissions,
        });
        docs.push(doc);
      }
      res.status(201).json(docs.length > 1 ? docs : docs[0]);
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const knowledgeId: string = req.params.id;
      const body: Partial<IKnowledge> = Array.isArray(req.body) ? req.body[0] : req.body;
      const { title, description, ...rest } = body;
      const _title = title || (await this._generateTitle(rest.data));
      const _description =
        description || (await this._generateSummary(rest.data));
      const updated = await Knowledge.findByIdAndUpdate(
        knowledgeId,
        { ...rest, title: _title, description: _description },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      );

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  public async getAllFromWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id: string = req.params.workspaceId;
      const knowledges = await Knowledge.find({ workspace: id });
      res.json(knowledges);
    } catch (error) {
      next(error);
    }
  }

  public async createKnowledgeBaseDocument(req: Request, _: Response, next: NextFunction) {
    try {
      const bodyArray = Array.isArray(req.body) ? req.body : [req.body];

      const newBody = [];
      for (const knowledge of bodyArray) {
        const knowledgeId = new mongoose.mongo.ObjectId();
        const vectorDb = new KnowledgeBase(knowledge.workspace.toString());

        const doc = new Document<KnowledgeMetadata>({
          pageContent: knowledge.data,
          metadata: {
            ownerDocumentId: knowledgeId.toString(),
            updatedAt: new Date().toISOString()
          }
        });
        await vectorDb.addDocuments([doc]);

        knowledge['_id'] = knowledgeId;
        newBody.push(knowledge);
      }

      req.body = newBody;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async deleteKnowledgeBaseDocument(req: Request, _: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { workspace } = await Knowledge.findById(id).select('workspace');

      await new KnowledgeBase(workspace.toString())
        .deleteDocumentsByOwnerDocumentId(id);

      next();
    } catch (error) {
      next(error);
    }
  }

  public async updateKnowledgeBaseDocument(req: Request, _: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const knowledge = req.body;
      const vectorDb = new KnowledgeBase(knowledge.workspace.toString());

      await vectorDb.deleteDocumentsByOwnerDocumentId(id);
      const doc = new Document<KnowledgeMetadata>({
        pageContent: knowledge.data,
        metadata: {
          ownerDocumentId: id,
          updatedAt: new Date().toISOString()
        }
      });
      await vectorDb.addDocuments([doc]);

      next();
    } catch (error) {
      next(error);
    }
  }

  public async addOpenAIFile(
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const openai = new OpenAI();

      const knowledges = Array.isArray(req.body) ? [...req.body] : [req.body];
      const newBody = [];

      for (const knowledge of knowledges) {
        let fileName: string;
        let fileContent: string | Buffer;
        const { file } = req;

        if (file) {
          const originalName = file.filename || file.originalname;
          const ext = originalName.split('.').at(-1);
          fileName = knowledge.title ? this._textToFilename(knowledge.title, ext) : originalName;

          fileContent = file.buffer;
          knowledge.description = fileName;
        } else {
          const ext = 'txt';
          const title = knowledge.title || (await this._generateTitle(knowledge.data));
          fileName = this._textToFilename(title, ext);

          fileContent = knowledge.data;
          knowledge.title = title;
        }

        fs.writeFileSync(`tmp/${fileName}`, fileContent);
        const fileToUpload = fs.createReadStream(`tmp/${fileName}`);

        const createdFile = await openai.files.create({ file: fileToUpload, purpose: 'assistants' });
        knowledge['openaiFileId'] = createdFile.id;

        newBody.push(knowledge);
      }
      req.body = newBody;

      next();
    } catch (error) {
      next(error);
    }
  }

  public async deleteOpenAIFile(
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const openai = new OpenAI();
      const { id } = req.params;
      const { openaiFileId } = await Knowledge
        .findById(id)
        .select('openaiFileId');

      await openai.files.del(openaiFileId);

      next();
    } catch (error) {
      next(error);
    }
  }

  public async replaceOpenAIFile(req: Request, _: Response, next: NextFunction): Promise<void> {
    try {
      if (req.body.data || req.file)
        await this.deleteOpenAIFile(req, _, async () => {
          await this.addOpenAIFile(req, _, next);
        });
      else next();
    } catch (error) {
      next(error);
    }
  }

  public async askQuestionUsingAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { question } = req.query;
      const { workspaceId } = req.params;
      const retrieverService = new KnowledgeRetrieverService({ workspaceId });
      const text = await retrieverService.question(question.toString());

      res.json({ text });
    } catch (error) {
      next(error);
    }
  }
}

export default new KnowledgeController();
