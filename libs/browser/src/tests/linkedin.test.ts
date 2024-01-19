import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
    const skills: Skill[] = [
        {
            "name": "Login on Linkedin",
            "description": "Use this to login on LinkedIn.",
            "inputs": {
                "email": {
                    "type": "string",
                    "description": "Email on LinkedIn account."
                },
                "password": {
                    "type": "string",
                    "description": "Password on LinkedIn account."
                }
            },
            "steps": [
                { "method": "loadUrl", "params": { "url": "https://www.linkedin.com/login" } },
                { "method": "inputText", "params": { "selector": "#username", "content": "{email}" } },
                { "method": "inputText", "params": { "selector": "#password", "content": "{password}" } },
                { "method": "click", "params": { "selector": ".btn__primary--large", "sleep": 10000 } }
            ]
        },
        {
            "name": "Extract Leads on LinkedIn",
            "description": "Use this to extract leads on LinkedIn.",
            "inputs": {
                "leads": {
                    "type": "string",
                    "description": "Extract leads on LinkedIn."
                }
            },
            "steps": [
                { "method": "loadUrl", "params": { "url": "https://www.linkedin.com/feed/" } },
                { "method": "inputText", "params": { "selector": ".search-global-typeahead__input", "content": "{leads}" } },
                { "method": "pressKey", "params": { "key": "Enter" } },
                { "method": "click", "params": { "selector": "li.search-reusables__primary-filter:nth-child(2) > button:nth-child(1)", "sleep": 10000 } },
                {
                    "method": "loop", "params": {
                        "times": 3, "steps": [
                            {
                                "method": "dataExtraction", "params": {
                                    "container": "ul.reusable-search__entity-result-list", "saveOn": "leads", "properties": [
                                        { "name": 'name', "selector": 'a:nth-child(1) > span:nth-child(1) > span:nth-child(1)' },
                                        { "name": 'profission', "selector": '.entity-result__primary-subtitle' },
                                        { "name": 'city', "selector": '.entity-result__secondary-subtitle' },
                                        { "name": 'current', "selector": '.entity-result__summary' },
                                        { "name": 'link', "selector": 'a:nth-child(1)', "attribute": "href" },
                                    ]
                                }
                            },
                            { "method": "click", "params": { "selector": ".artdeco-pagination__button--next", "sleep": 10000 } },
                            { "method": "saveOnFile", "params": { "fileName": "xandr-audiences", "memoryKey": "audiences" } }

                        ]
                    }
                },
            ]
        },
    ]
    const email = process.env.LINKEDIN_USERNAME
    const password = process.env.LINKEDIN_PASSWORD

    // TODO: switch to personal email for testing
    const memory = `
    LinkedIn:
    - Email: ${email}
    - Password: ${password}
    - Leads: "Software Engineer`

    const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

    beforeAll(async () => {
        await browserAgent.seed();
    });

    test('LinkedIn login', async () => {
        const resultLogin = await browserAgent.executorAgent.invoke({
            input: 'Login on LinkedIn'
        })
        console.log(resultLogin)
    });

    test('Extract Leads', async () => {
        const resultLogin = await browserAgent.executorAgent.invoke({
            input: 'Extract leads on LinkedIn.'
        })
        console.log(resultLogin)
    });
});