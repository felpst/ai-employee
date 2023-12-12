/* eslint-disable @typescript-eslint/no-explicit-any */
import { RepositoryHelper } from '@cognum/helpers';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

class ModelController<T extends Model<any>> {
  private _repository: RepositoryHelper<T>;

  constructor(private model: T) {
    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this._repository = new RepositoryHelper(this.model, req['userId']);
      const data = await this._repository.create(req.body);
      res.locals.data = data
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  public async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this._repository = new RepositoryHelper(this.model, req['userId']);
      const data = await this._repository.find(req.query);
      res.json(data);
    } catch (error) {
      console.error(error)
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this._repository = new RepositoryHelper(this.model, req['userId']);
      const data = await this._repository.getById(req.params.id, req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this._repository = new RepositoryHelper(this.model, req['userId']);
      const data = await this._repository.update(req.params.id, req.body);
      res.locals.data = data // ??
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this._repository = new RepositoryHelper(this.model, req['userId']);
      const data = await this._repository.delete(req.params.id);
      res.locals.data = data
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default ModelController;
