import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../../tests/agent-test';
import { WebBrowser } from '../../web-browser';
import { WebBrowserExtractDataTool } from '../../web-browser-extract-data.tool';
import { WebBrowserService } from '../../web-browser.service';
import { WebBrowserToolSettings } from '../../web-browser.toolkit';


describe('Extract Content Tool test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;
    const webBrowser = new WebBrowser();
    const service = new WebBrowserService(webBrowser);


    beforeAll(async () => {
        await webBrowser.start({ headless: false });
        const settings: WebBrowserToolSettings = { webBrowser };
        const tools = [
            new WebBrowserExtractDataTool(settings)
        ];
        executor = await agentTest(tools);
    });

    it('should find element selectorType and selector of table', async () => {
        await service.loadPage('https://www.skysports.com/la-liga-table');
        const inputText = 'extract data of ten first teams of the La liga Table';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('Girona');
        expect(result.output).toContain('Real Madrid');
        expect(result.output).toContain('Barcelona');
    })

    it('should find element selectorType and selector of div', async () => {
        await service.loadPage('https://www.tibia.com/news/?subtopic=latestnews');
        const inputText = 'extract data of news ticker of tibia';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('Winter Update 2023');
    })

});
