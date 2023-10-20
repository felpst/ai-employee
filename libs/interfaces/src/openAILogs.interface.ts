import { Types } from "mongoose";

export interface IOpenAILogs {
    _id: Types.ObjectId | string;
    component: string;
    relatedFiles: string;
    codeLine: number;
    openAIKey: string;
    createdAt: Date;
    parameters?: any;
}
