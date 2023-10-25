import { IOpenAILogs, OpenAILogs } from "../entities/OpenAILogs";
import { IOpenAILogsRepository } from "./OpenAILogsRepository";


export class InMemoryOpenAILogsRepository implements IOpenAILogsRepository {
    private logs: OpenAILogs[] = [];

   create(logs: Partial<IOpenAILogs>): Promise<IOpenAILogs> {
        const createdLogs = new OpenAILogs(logs);
        this.logs.push(createdLogs);
        return Promise.resolve(createdLogs);
    }

     findAll(): Promise<OpenAILogs[]> {
        return  Promise.resolve(this.logs)
    }

    findByOpenAIKeys(OpenAIKey: string): Promise<OpenAILogs[]> {
        const logs = this.logs.filter(log => log.OpenAIKey === OpenAIKey);
        return Promise.resolve(logs);
    }
}