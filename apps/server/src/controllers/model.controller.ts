/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

interface MongoosePopulateQuery {
  path: string | string[];
  select?: any;
  model?: string | Model<any>;
  match?: any;
}
class ModelController<T extends Model<any>> {
  private _populate: MongoosePopulateQuery[] = [];

  constructor(private model: T) {
    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  private _setUser(data: any, userId: string) {
    if (!userId) return;
    if (!data.createdBy) {
      data.createdBy = userId;
    }
    data.updatedBy = userId;
  }

  addPopulateQuery(populateQuery: MongoosePopulateQuery) {
    this._populate.push(populateQuery);
  }

  private _populateQuery(query) {
    for (const p of this._populate) {
      query = query.populate(p);
    }
    return query;
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataset = Array.isArray(req.body) ? [...req.body] : [req.body];
      const docs = [];
      for (const data of dataset) {
        this._setUser(data, req['userId']);
        const doc = await this.model.create(data);
        docs.push(doc);
      }
      res.locals.data = docs

      res.status(201).json(docs.length > 1 ? docs : docs[0]);
    } catch (error) {
      next(error);
    }
  }

  public async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const select = (req.query.select as string) || '';
      const sort = (req.query.sort as string) || [];
      const filter = (req.query.filter as any) || {};
      const populate = (req.query.populate as any) || [];
      const limit = (req.query.limit as any) || 100;
      for (const p of populate) {
        this._populate.push(p);
      }

      const list = await this._populateQuery(
        this.model.find(filter).sort(sort).limit(limit).select(select)
      );
      res.json(list);
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const populate = (req.query.populate as any) || [];
      for (const p of populate) {
        this._populate.push(p);
      }

      const id: string = req.params.id;
      const item = await this._populateQuery(this.model.findById(id));
      if (!item) {
        const error: any = new Error('Document not found');
        error.status = 404;
        throw error;
      }

      res.json(item);
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
      const taskId: string = req.params.id;
      const data = req.body;
      this._setUser(data, req['userId']);

      const updated = await this.model.findByIdAndUpdate(taskId, data, {
        returnDocument: 'after',
        runValidators: true,
      });
      res.locals.data = updated

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const taskId: string = req.params.id;
      const deletedTask = await this.model.findByIdAndDelete(taskId);

      if (!deletedTask) {
        const error: any = new Error('Document not found');
        error.status = 404;
        throw error;
      }
      res.locals.data = deletedTask

      res.json(deletedTask);
    } catch (error) {
      next(error);
    }
  }
}

export default ModelController;
