import { IOpenAILogs } from "@cognum/interfaces";
import { Document, Model, Schema, Types, model } from "mongoose";

export interface IOpenAILogsDocument extends IOpenAILogs, Document { 
    _id: Types.ObjectId;
}

const OpenAILogsSchema = new Schema<IOpenAILogsDocument>({
    component: { type: String, required: false },
    relatedFiles: { type: String, required: false },
    codeLine: { type: Number, required: false },
    openAIKey: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    parameters: { type: Object, required: false },   
},
{
    timestamps: true,
}
);

export interface IOpenAILogsRepository {
    create(logs: Partial<IOpenAILogs>): Promise<IOpenAILogs>;
    findAll(): Promise<IOpenAILogs[]>;
    findByOpenAIKeys(OpenAIKey: string): Promise<IOpenAILogs[]>;
}

const OpenAILogsModel = model<IOpenAILogsDocument>("OpenAILogs", OpenAILogsSchema);

export default class OpenAILogsRepository implements IOpenAILogsRepository {
    private model: Model<IOpenAILogsDocument>;

    constructor(model: Model<IOpenAILogsDocument> = OpenAILogsModel) {
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