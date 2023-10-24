import { get } from 'stack-trace';
import { OpenAILogs } from "../entities/OpenAILogs";
import { IOpenAILogsRepository } from "../repositories/OpenAILogsRepository";
import { extractPathFromDist } from '../utils/extractPath';
import { splitOpenAIKey } from "../utils/splitOpenAIKey";

interface CreateOpenAILogsRequest {
    component: string;
    relatedFiles: string;
    codeLine: number;
    openAIKey: string;
    createdAt: Date;
    parameters?: any;
}

interface CreateOpenAILogsResponse {
    id: string;
    component: string;
    relatedFiles: string;
    codeLine: number;
    openAIKey: string;
    createdAt: Date;
    parameters?: any;
}


export class CreateOpenAILogs {
    private OpenAILogsRepository: IOpenAILogsRepository;


    constructor(OpenAILogsRepository: IOpenAILogsRepository) {
        this.OpenAILogsRepository = OpenAILogsRepository;
    }

    async execute(request: CreateOpenAILogsRequest): Promise<CreateOpenAILogsResponse> {

        const stack = get();
        console.trace('rastro')
        const openAILogsData = {
            component: stack[4].getFunctionName(),
            relatedFiles: extractPathFromDist(stack[4].getFileName()),
            codeLine: stack[4].getLineNumber(),
            openAIKey: splitOpenAIKey(process.env.AZURE_OPENAI_API_KEY),
            createdAt: new Date(),
            params: { ...request },
        };

        const openAILogs = new OpenAILogs(openAILogsData);

        const savedOpenAILogs = await this.OpenAILogsRepository.create(openAILogs);
        
        
        return {
            id: savedOpenAILogs._id.toString(),
            ...savedOpenAILogs
        };

    }
}
