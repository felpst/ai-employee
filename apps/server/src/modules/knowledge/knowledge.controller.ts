import { IKnowledge, KnowledgeTypeEnum } from '@cognum/interfaces';
import KnowledgeBase, { KnowledgeMetadata } from '@cognum/knowledge-base';
import { ChatModel } from '@cognum/llm';
import { Knowledge } from '@cognum/models';
import { CronService, KnowledgeRetrieverService, SchedulerService } from '@cognum/tools';
import { NextFunction, Request, Response } from 'express';
import { LLMChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { PromptTemplate } from '@langchain/core/prompts';
import mongoose from 'mongoose';
import ModelController from '../../controllers/model.controller';

export class KnowledgeController extends ModelController<typeof Knowledge> {
  constructor() {
    super(Knowledge);
    this.addOpenAIFile = this.addOpenAIFile.bind(this);
    this.replaceOpenAIFile = this.replaceOpenAIFile.bind(this);
    this.cronUpdate = this.cronUpdate.bind(this);
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
      const knowledgeRetrieverSvc = new KnowledgeRetrieverService();

      const knowledges: Partial<IKnowledge & { timeZone?: string; }>[] =
        Array.isArray(req.body) ? [...req.body] : [req.body];
      const newBody = [];

      for (const knowledge of knowledges) {
        let fileName: string;
        let fileContent: string | Buffer;

        if (knowledge.type === KnowledgeTypeEnum.Html) {
          const timeZone = knowledge.timeZone;
          delete knowledge.timeZone;

          const knowledgeId =
            knowledge._id || new mongoose.mongo.ObjectId();
          knowledge.title ??= knowledge.contentUrl;

          fileName = this._textToFilename(knowledge.title, 'html');
          fileContent = await fetch(knowledge.contentUrl)
            .then(response => response.text());

          if (knowledge.htmlUpdateFrequency) {
            const cron = await CronService.fromText(knowledge.htmlUpdateFrequency);
            knowledge.htmlUpdateFrequency = cron.formattedInput;
            await new SchedulerService().createJob({
              name: `knowledge-${knowledgeId}-content-update`,
              schedule: cron.formattedCron,
              httpTarget: {
                uri: `${process.env.SERVER_URL}/knowledges/${knowledgeId}/scheduled-update`,
                httpMethod: 'PATCH',
              },
              timeZone
            });
          }

          knowledge.description = fileName;
        }

        if (knowledge.type === KnowledgeTypeEnum.File) {
          const { file } = req;

          fileContent = file.buffer;
          fileName = file.filename || file.originalname;

          knowledge.title ??= fileName;
          knowledge.description = fileName;
        }

        if (knowledge.type === KnowledgeTypeEnum.Document) {
          knowledge.title ??= await this._generateTitle(knowledge.data);

          fileContent = knowledge.data;
          fileName = this._textToFilename(knowledge.title, 'txt');
        }

        const createdFile = await knowledgeRetrieverSvc.createFile(fileName, fileContent);

        knowledge.openaiFileId = createdFile.id;
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
      const { id } = req.params;
      const { openaiFileId, htmlUpdateFrequency } = await Knowledge
        .findById(id)
        .select(['openaiFileId', 'htmlUpdateFrequency']);

      try {
        await new SchedulerService().deleteJob(`knowledge-${id}-content-update`);
      } catch (error) { }

      try {
        await new KnowledgeRetrieverService().deleteFile(openaiFileId);
      } catch (error) { }

      next();
    } catch (error) {
      next(error);
    }
  }

  public async replaceOpenAIFile(req: Request, _: Response, next: NextFunction): Promise<void> {
    try {
      const body: Partial<IKnowledge> = req.body;
      const validFileReplacementCases = [
        body.type === KnowledgeTypeEnum.Document && body.data,
        body.type === KnowledgeTypeEnum.Html && body.contentUrl,
        body.type === KnowledgeTypeEnum.File && req.file,
      ].map(Boolean);

      if (validFileReplacementCases.includes(true))
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
      const question = req.query.question?.toString();
      const { workspaceId } = req.params;
      if (!question?.trim())
        throw new Error('Invalid question. Question must be a non-empty string.');

      const knowledges = (await Knowledge.find({ workspace: workspaceId }).select('openaiFileId').lean());
      const fileIds = knowledges.map(({ openaiFileId }) => openaiFileId);

      const text = await new KnowledgeRetrieverService()
        .askToAssistant(question, fileIds);

      res.json({ text });
    } catch (error) {
      next(error);
    }
  }

  public async askQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const question = req.query.question?.toString();
      const { id } = req.params;
      if (!question?.trim())
        throw new Error('Invalid question. Question must be a non-empty string.');

      const { openaiFileId } = await Knowledge.findById(id).select('openaiFileId');

      const retrieverService = new KnowledgeRetrieverService();
      const text = await retrieverService.askToAssistant(question, [openaiFileId]);

      res.json({ text });
    } catch (error) {
      next(error);
    }
  }

  public async cronUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, contentUrl, openaiFileId } = await Knowledge
        .findById(id)
        .select(['title', 'contentUrl', 'openaiFileId']);

      const fileName = this._textToFilename(title, 'html');
      const content = await fetch(contentUrl)
        .then(response => response.text());

      const openaiSvc = new KnowledgeRetrieverService();
      await openaiSvc.deleteFile(openaiFileId);
      const newFile = await openaiSvc.createFile(fileName, content);

      const result = await Knowledge.findByIdAndUpdate(id, {
        $set: {
          openaiFileId: newFile.id
        }
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new KnowledgeController();
