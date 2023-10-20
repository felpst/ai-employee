import callsites from 'callsites';
import { OpenAILogs } from "../entities/OpenAILogs";
import { IOpenAILogsRepository } from "../repositories/OpenAILogsRepository";
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

        const stack = callsites();
        
        const openAILogsData = {
            component: stack[1].getFunctionName(),
            relatedFiles: stack[1].getFileName(),
            codeLine: stack[1].getLineNumber(),
            openAIKey: splitOpenAIKey(process.env.OPENAI_API_KEY),
            ...request,
        };

        const openAILogs = new OpenAILogs(openAILogsData);

        const savedOpenAILogs = await this.OpenAILogsRepository.create(openAILogs);
        
        console.log(openAILogsData);
        
        return {
            id: savedOpenAILogs._id.toString(),
            ...savedOpenAILogs
        };

    }
}
