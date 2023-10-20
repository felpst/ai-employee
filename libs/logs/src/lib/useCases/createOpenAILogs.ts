import { OpenAILogs } from "../entities/OpenAILogs";
import { IOpenAILogsRepository } from "../repositories/OpenAILogsRepository";

interface CreateOpenAILogsRequest {
    component: string;
    relatedFiles: string;
    codeLine: number;
    OpenAIKey: string;
    createdAt: Date;
    parameters?: any;
}

interface CreateOpenAILogsResponse {
    id: string;
    component: string;
    relatedFiles: string;
    codeLine: number;
    OpenAIKey: string;
    createdAt: Date;
    parameters?: any;
}


export class CreateOpenAILogsUseCase {
    private OpenAILogsRepository: IOpenAILogsRepository;


    constructor(OpenAILogsRepository: IOpenAILogsRepository) {
        this.OpenAILogsRepository = OpenAILogsRepository;
    }

    async execute(request: CreateOpenAILogsRequest): Promise<CreateOpenAILogsResponse> {

        const openAILogs = new OpenAILogs(request);

        const savedOpenAILogs = await this.OpenAILogsRepository.create(openAILogs);

        return {
            id: savedOpenAILogs._id.toString(),
            ...savedOpenAILogs
        };

    }
}
