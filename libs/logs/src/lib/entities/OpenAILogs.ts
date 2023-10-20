import { Types } from 'mongoose';

export interface IOpenAILogs {
    _id?: Types.ObjectId;
    component: string;
    relatedFiles: string;
    codeLine: number;
    OpenAIKey: string;
    createdAt: Date;
    parameters?: any;
}

export class OpenAILogs implements IOpenAILogs {
    _id?: Types.ObjectId;
    component: string;
    relatedFiles: string;
    codeLine: number;
    OpenAIKey: string;
    createdAt: Date;
    parameters?: any;

    constructor(logs: IOpenAILogs) {
        this._id = logs._id;
        this.component = logs.component;
        this.relatedFiles = logs.relatedFiles;
        this.codeLine = logs.codeLine;
        this.OpenAIKey = logs.OpenAIKey;
        this.createdAt = logs.createdAt;
        this.parameters = logs.parameters;
    }
}