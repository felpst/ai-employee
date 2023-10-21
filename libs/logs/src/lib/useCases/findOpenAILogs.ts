import { IOpenAILogsRepository } from "../repositories/OpenAILogsRepository";

interface FindOpenAILogsResponse {
    _id: string;
    component: string;
    relatedFiles: string;
    codeLine: number;
    openAIKey: string;
    createdAt: Date;
    parameters?: any;
}

export class FindOpenAILogs {
    private OpenAILogsRepository: IOpenAILogsRepository;

    constructor (OpenAILogsRepository: IOpenAILogsRepository) {
        this.OpenAILogsRepository = OpenAILogsRepository;
    }

    async byApiKey(openAIKey: string): Promise<FindOpenAILogsResponse[]> {
        const logs = await this.OpenAILogsRepository.findByOpenAIKeys(openAIKey);
        
        if (logs.length <= 0){
            throw new Error('Not exist logs with this OpenAIKey');
        }

        return logs.map(log => ({
            _id: log._id.toString(),
            component: log.component,
            relatedFiles: log.relatedFiles,
            codeLine: log.codeLine,
            OpenAIKey: log.openAIKey,
            createdAt: log.createdAt,
            parameters: log.parameters
        }));
    }

    async all(): Promise<FindOpenAILogsResponse[]> {

        const logs = await this.OpenAILogsRepository.findAll();

        if (logs.length <= 0){
            throw new Error('Not exist logs');
        }

        return logs.map(log => ({
            _id: log._id.toString(),
            component: log.component,
            relatedFiles: log.relatedFiles,
            codeLine: log.codeLine,
            OpenAIKey: log.openAIKey,
            createdAt: log.createdAt,
            parameters: log.parameters
        }));
    }
}