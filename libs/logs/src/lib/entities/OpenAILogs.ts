import { Types } from 'mongoose';

export interface IOpenAILogs {
    _id?: Types.ObjectId | string;
    component: string;
    relatedFiles: string;
    codeLine: number;
    OpenAIKey: string;
    createdAt: Date;
    parameters?: any;
}

export class OpenAILogs implements IOpenAILogs {
    _id = Math.random().toString(36).substring(2, 9);
    component = '';
    relatedFiles = '';
    codeLine = 0;
    OpenAIKey = '';
    createdAt = new Date();
    parameters? = '';

    constructor(params: Partial<IOpenAILogs> = {}) {
        Object.assign(this, params);
    }
}

    
