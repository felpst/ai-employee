import { IOpenAILogs } from '@cognum/interfaces';

export class OpenAILogs implements IOpenAILogs {
    _id = Math.random().toString(36).substring(2, 9);
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

    
