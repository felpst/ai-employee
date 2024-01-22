import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

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
                { "method": "if", "params": { "condition": "!browserMemory.currentUrl.includes('linkedin.com/feed')", "steps": [
                  { "method": "inputText", "params": { "selector": "#username", "content": "{email}" } },
                  { "method": "inputText", "params": { "selector": "#password", "content": "{password}" } },
                  { "method": "click", "params": { "selector": ".btn__primary--large" } }
                ]}}
            ],
            "successMessage": "LinkedIn Login successful!"
        },
        {
            "name": "Extract Leads on LinkedIn",
            "description": "Use this to extract leads on LinkedIn.",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Query to search leads on LinkedIn."
                }
            },
            "steps": [
                { "method": "if", "params": { "condition": "!browserMemory.currentUrl.includes('linkedin.com/feed')", "steps": [
                  { "method": "loadUrl", "params": { "url": "https://www.linkedin.com/feed/" } },
                ]}},
                { "method": "inputText", "params": { "selector": ".search-global-typeahead__input", "content": "{query}" } },
                { "method": "pressKey", "params": { "key": "Enter" } },
                { "method": "click", "params": { "selector": "li.search-reusables__primary-filter:nth-child(2) > button:nth-child(1)", "sleep": 10000 } },
                { "method": "loop", "params": { "times": 3, "steps": [
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
                    { "method": "click", "params": { "selector": ".artdeco-pagination__button--next", "sleep": 5000 } },
                  ]}
                },
                { "method": "saveOnFile", "params": { "fileName": "linkedin-leads", "memoryKey": "leads" } }
            ]
        },
    ]
    const email = process.env.LINKEDIN_USERNAME
    const password = process.env.LINKEDIN_PASSWORD

    // TODO: switch to personal email for testing
    const memory = `
    LinkedIn:
    - Email: ${email}
    - Password: ${password}`

    const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

    beforeAll(async () => {
        await browserAgent.seed();
    });

    test('LinkedIn login', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Login on LinkedIn'
        })
        console.log(JSON.stringify(result))
    });

    test('Extract Leads', async () => {
        const resultLogin = await browserAgent.executorAgent.invoke({
            input: 'Extract Software Engineers leads on LinkedIn.'
        })
        console.log(resultLogin)
    });
});
