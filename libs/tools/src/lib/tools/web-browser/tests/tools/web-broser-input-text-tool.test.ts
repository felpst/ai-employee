import 'dotenv/config';
import {
    AgentExecutor
} from 'langchain/agents';
import { agentTest } from '../../../../tests/agent-test';
import { WebBrowser } from '../../web-browser';
import { WebBrowserInputTextTool } from '../../web-browser-input-text.tool';
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
            new WebBrowserInputTextTool(settings)
        ];
        executor = await agentTest(tools);
    });

    it('click on microsoft login button', async () => {
        await service.loadPage('https://invest.xandr.com/login');
        const inputText = "put on username input 'linecker@cognum.ai'";
        const result = await executor.call({ input: inputText });
        console.log(result.output);
        expect(result.output).toContain('has been clicked');
    })

});
