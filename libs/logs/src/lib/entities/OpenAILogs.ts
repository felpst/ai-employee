import { IOpenAILogs } from '@cognum/interfaces';
import { Types } from 'mongoose';

export class OpenAILogs implements IOpenAILogs {
    _id = new Types.ObjectId()
    component = '';
    relatedFiles = '';
    codeLine = 0;
    openAIKey = '';
    createdAt = new Date();
    parameters? = '';

    constructor(params: Partial<IOpenAILogs> = {}) {
        Object.assign(this, params);
    }
}

    
