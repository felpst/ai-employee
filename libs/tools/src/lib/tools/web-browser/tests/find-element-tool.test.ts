import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../tests/agent-test';
import { WebBrowser } from '../web-browser';
import { WebBrowserFindElementTool } from '../web-browser-find-element.tool';
import { WebBrowserService } from '../web-browser.service';
import { WebBrowserToolSettings } from '../web-browser.toolkit';


describe('Find Element Tool test', () => {
    jest.setTimeout(300000)
    let executor!: AgentExecutor;
    const webBrowser = new WebBrowser();
    const service = new WebBrowserService(webBrowser);


    beforeAll(async () => {
        await webBrowser.start({ headless: false });
        const settings: WebBrowserToolSettings = { webBrowser };
        const tools = [
            new WebBrowserFindElementTool(settings)
        ];
        executor = await agentTest(tools);
    });

    it('should find element selectorType and selector of table', async () => {
        await service.loadPage('https://www.skysports.com/la-liga-table');
        const inputText = 'return selectorType and selector of la ligas table';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toHaveProperty('selector')
        expect(result.output).toHaveProperty('selectorType')
    })

});
