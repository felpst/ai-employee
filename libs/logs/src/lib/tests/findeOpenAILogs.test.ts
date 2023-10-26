import { IOpenAILogs } from "../entities/OpenAILogs";
import { InMemoryOpenAILogsRepository } from "../repositories/InMemoryOpenAILogsRepository";
import { FindOpenAILogs } from '../useCases/findOpenAILogs';

describe('FindOpenAILogs', () => {
    let findeOpenAILogs: FindOpenAILogs;
    let OpenAILogsRepository: InMemoryOpenAILogsRepository;
    let createOpenAILogs: IOpenAILogs;

    beforeEach(async () => {
        OpenAILogsRepository = new InMemoryOpenAILogsRepository();
        findeOpenAILogs = new FindOpenAILogs(OpenAILogsRepository);

        createOpenAILogs = await OpenAILogsRepository.create({
            component: 'test',
            relatedFiles: 'test',
            codeLine: 1,
            OpenAIKey: 'ABC123',
            createdAt: new Date(),
            parameters: {
                test: 'test'
            }
        });
    });

    it('should be able to find a OpenAILogs by OpenAIKey', async () => {
        const response = await findeOpenAILogs.byApiKey(createOpenAILogs.OpenAIKey);

        expect(response[0]).toHaveProperty('_id');
        expect(response[0].component).toBe('test');
        expect(response[0].relatedFiles).toBe('test');
        expect(response[0].codeLine).toBe(1);
        expect(response[0].OpenAIKey).toBe('ABC123');
        expect(response[0].createdAt).toBeInstanceOf(Date);
        expect(response[0].parameters).toHaveProperty('test');
    });

    it('should find all OpenAILogs', async () => {
        const response = await findeOpenAILogs.all();

        expect(response.length).toBeGreaterThan(0);
    });

});