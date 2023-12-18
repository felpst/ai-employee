/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";

export interface MoongoseQuery {
  select?: string,
  sort?: string,
  filter?: any,
  populate?: any,
  limit?: number
}

interface MongoosePopulateQuery {
  path: string | string[];
  select?: any;
  model?: string | Model<any>;
  match?: any;
}

export class RepositoryHelper<T extends any | any[]> {
  private _populate: MongoosePopulateQuery[] = [];

  constructor(private model: Model<T>, private userId?: string) {
    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private _setUser(data: any) {
    if (!this.userId) return;
    if (!data.createdBy) { data.createdBy = this.userId; }
    data.updatedBy = this.userId;
  }

  addPopulateQuery(populateQuery: MongoosePopulateQuery) {
    this._populate.push(populateQuery);
  }

  private _populateQuery(query: any) {
    for (const p of this._populate) {
      query = query.populate(p);
    }
    return query;
  }

  // Create document
  public async create(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
    const dataset = Array.isArray(data) ? [...data] : [data];
    const docs: T[] = [];
    for (const data of dataset) {
      this._setUser(data);
      const doc = await this.model.create(data);
      docs.push(doc);
    }
    return docs.length > 1 ? docs : docs[0];
  }

  // Find documents
  public async find(query?: MoongoseQuery): Promise<T[]> {
    const select = (query?.select as string) || '';
    const sort = (query?.sort as string) || [];
    const filter = (query?.filter as any) || {};
    const populate = (query?.populate as any) || [];
    const limit = (query?.limit as number) || 100;

    for (const p of populate) {
      this._populate.push(p);
    }

    const list = await this._populateQuery(
      this.model.find(filter).sort(sort).limit(limit).select(select)
    );

    return list || []
  }

  // Get document by id
  public async getById(_id: string, query: MoongoseQuery = {}): Promise<T> {
    if (!query.filter) { query.filter = {}; }
    query.filter._id = _id;
    const list = await this.find(query)
    if (!list.length) { throw new Error(`Document not found: ${_id}`); }
    return list[0];
  }

  // Update document
  public async update(_id: string, data: Partial<T>): Promise<T> {
    this._setUser(data);
    const updated = await this.model.findByIdAndUpdate(_id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    return updated as T;
  }

  // Delete document
  public async delete(_id: string) {
    const deleted = await this.model.findByIdAndDelete(_id);
    if (!deleted) {
      throw new Error('Document not found');
    }
    return deleted;
  }

}
