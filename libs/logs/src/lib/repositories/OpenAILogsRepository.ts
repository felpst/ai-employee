import { Document, Model, Schema, Types, model } from "mongoose";
import { IOpenAILogs } from "../entities/OpenAILogs";

export interface OpenAILogsDocument extends IOpenAILogs, Document { 
    _id: Types.ObjectId;
}

const OpenAILogsSchema: Schema = new Schema({
    component: { type: String, required: true },
    relatedFiles: { type: String, required: true },
    codeLine: { type: Number, required: true },
    OpenAIKey: { type: String, required: true },
    createdAt: { type: Date, required: true },
    parameters: { type: Object, required: false }
},
{
    timestamps: true
}
);

export interface IOpenAILogsRepository {
    create(logs: Partial<IOpenAILogs>): Promise<IOpenAILogs>;
    findAll(): Promise<IOpenAILogs[]>;
    findByOpenAIKeys(OpenAIKey: string): Promise<IOpenAILogs[]>;
}

const OpenAILogsModel = model<OpenAILogsDocument>('OpenAILogs', OpenAILogsSchema);

export default class OpenAILogsRepository implements IOpenAILogsRepository {
    private model: Model<OpenAILogsDocument>;

    constructor(model: Model<OpenAILogsDocument> = OpenAILogsModel) {
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