import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { WebBrowserService } from './web-browser.service';
import { WebBrowserToolSettings } from './web-browser.toolkit';

export class WebBrowserFindElementTool extends DynamicStructuredTool {
    constructor(settings: WebBrowserToolSettings) {
        super({
            name: 'Web Browser Find Component',
            metadata: { id: "web-browser", tool: 'findElement' },
            description: 'Use this tool to find a elements on web browser',
            schema: z.object({
                idOrClass: z.string().describe("id or class of the element to find"),
            }),
            func: async ({ idOrClass }) => {
                try {
                    const browserService = new WebBrowserService(settings.webBrowser);
                    const loaded = await browserService.inspectElement(idOrClass);
                    if (!loaded) throw new Error(`element not found on web browser: ${idOrClass}`);
                    return `html: ${loaded.html} \n attributes: ${loaded.attributes}`;
                } catch (error) {
                    return error.message;
                }
            },
        });
    }
}
