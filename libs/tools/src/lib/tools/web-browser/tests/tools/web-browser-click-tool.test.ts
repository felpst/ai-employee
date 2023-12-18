import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../../tests/agent-test';
import { WebBrowser } from '../../web-browser';
import { WebBrowserClickTool } from '../../web-browser-click.tool';
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
            new WebBrowserClickTool(settings)
        ];
        executor = await agentTest(tools);
    });

    it('click on microsoft login button', async () => {
        await service.loadPage('https://invest.xandr.com/login');
        const inputText = 'click on microsoft sign in button on xandr login page';
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('has been clicked');
    })

});
