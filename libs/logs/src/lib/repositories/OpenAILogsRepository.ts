import { IOpenAILogs } from "@cognum/interfaces";
import { OpenAILogsModel } from '@cognum/models';
import { Document, Model, Types } from "mongoose";

export interface OpenAILogsDocument extends IOpenAILogs, Document { 
    _id: Types.ObjectId;
}

export interface IOpenAILogsRepository {
    create(logs: Partial<IOpenAILogs>): Promise<IOpenAILogs>;
    findAll(): Promise<IOpenAILogs[]>;
    findByOpenAIKeys(OpenAIKey: string): Promise<IOpenAILogs[]>;
}

export default class OpenAILogsRepository implements IOpenAILogsRepository {
    private model: Model<any>;

    constructor(model: Model<any> = OpenAILogsModel) {
        this.model = model;
    }

    public async create(logs: Partial<IOpenAILogs>): Promise<IOpenAILogs> {
        const createdLogs = await this.model.create(logs);
        return createdLogs;
    }

    public async findAll(): Promise<IOpenAILogs[]> {
        const logs = await this.model.find();
        return logs;
    }

    public async findByOpenAIKeys(OpenAIKey: string): Promise<IOpenAILogs[]> {
        const logs = await this.model.find({ OpenAIKey });
        return logs;
    }
}