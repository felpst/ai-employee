import { IOpenAILogs } from "@cognum/interfaces";
import OpenAILogsRepository from "../repositories/OpenAILogsRepository";
import { CreateOpenAILogs } from "../useCases/createOpenAILogs";


export class OpenAILogsService {
    private OpenAILogsRepository = new OpenAILogsRepository()


    async log(params: IOpenAILogs['parameters']): Promise<void> {
        const createLog = new CreateOpenAILogs(this.OpenAILogsRepository);
        await createLog.execute(params);
    }
}