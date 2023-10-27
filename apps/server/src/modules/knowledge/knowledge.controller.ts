import { IKnowledge } from '@cognum/interfaces';
import { ChatModel } from '@cognum/llm';
import { Knowledge } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import ModelController from '../../controllers/model.controller';

export class KnowledgeController extends ModelController<typeof Knowledge> {
  constructor() {
    super(Knowledge);
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
      const body: Partial<IKnowledge> = req.body;
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
}

export default new KnowledgeController();
