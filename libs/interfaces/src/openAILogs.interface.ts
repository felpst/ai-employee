import { Types } from "mongoose";

export interface IOpenAILogs {
    _id: Types.ObjectId;
    component: string;
    relatedFiles: string;
    codeLine: number;
    openAIKey: string;
    createdAt: Date;
    parameters?: any;
}
