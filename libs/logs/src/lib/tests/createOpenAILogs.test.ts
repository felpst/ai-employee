import { InMemoryOpenAILogsRepository } from '../repositories/InMemoryOpenAILogsRepository';
import { CreateOpenAILogs } from '../useCases/createOpenAILogs';
import exp = require('constants');

describe('OpenAILogs', () => {
    let createOpenAILogs: CreateOpenAILogs;
    let OpenAILogsRepository: InMemoryOpenAILogsRepository;

    beforeEach(() => {
        OpenAILogsRepository = new InMemoryOpenAILogsRepository();
        createOpenAILogs = new CreateOpenAILogs(OpenAILogsRepository);
    });

    it('should be able to create a new OpenAILogs', async () => {
        const request = await createOpenAILogs.execute({
            component: 'test',
            relatedFiles: 'test',
            codeLine: 1,
            OpenAIKey: 'ABC123',
            createdAt: new Date(),
            parameters: {
                test: 'test'
            }
        });

        expect(request).toHaveProperty('id');
        expect(request.component).toBe('test');
        expect(request.relatedFiles).toBe('test');
        expect(request.codeLine).toBe(1);
        expect(request.OpenAIKey).toBe('ABC123');
        expect(request.createdAt).toBeInstanceOf(Date);
        expect(request.parameters).toHaveProperty('test');
    });

});