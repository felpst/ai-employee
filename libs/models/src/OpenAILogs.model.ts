import { IOpenAILogs } from '@cognum/interfaces';
import { Schema, model } from 'mongoose';
import { defaultSchemaProps, triggers } from './default.model';

const schema = new Schema<IOpenAILogs>({

    component: {
        type: String,
        required: true,
    },
    relatedFiles: {
        type: String,
        required: true,
    },
    codeLine: {
        type: Number,
        required: true,
    },
    openAIKey: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    parameters: {
        type: Object,
        required: false,
    },
    ...defaultSchemaProps,
});
triggers(schema);

const OpenAILogsModel = model<IOpenAILogs>('OpenAILogs', schema);
export default OpenAILogsModel;

