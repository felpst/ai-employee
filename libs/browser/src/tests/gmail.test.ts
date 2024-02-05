import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
    jest.setTimeout(600000);

    const skills: Skill[] = [
        {
            "name": "Login on Google",
            "description": "Use this to login on Google.",
            "inputs": {
              "email": {
                "type": "string",
                "description": "Email on Google account."
              },
              "password": {
                "type": "string",
                "description": "Password on Google account."
              }
            },
            "steps": [
              { "method": "loadUrl", "params": { "url": "https://accounts.google.com/" } },
              { "method": "if", "params": { "condition": "!browserMemory.currentUrl.includes('myaccount.google.com')", "steps": [
                { "method": "inputText", "params": { "selector": "#identifierId", "content": "{email}" } },
                { "method": "click", "params": { "selector": "#identifierNext", "sleep": 5000 } },
                { "method": "inputText", "params": { "selector": "input[name='Passwd']", "content": "{password}" } },
                { "method": "click", "params": { "selector": "#passwordNext", "sleep": 5000 } }
              ]}},
            ],
            "successMessage": "Google Login successful!"
        },
        {
            "name": "List emails on Gmail",
            "description": "Use this to list emails on Gmail.",
            "inputs": {},
            "steps": [
              { "method": "loadUrl", "params": { "url": "https://mail.google.com/" } },
              { "method": "dataExtraction", "params": { "container": "table.F.cf.zt > tbody ", "saveOn": "emails", "properties": [
                { "name": 'from', "selector": 'td.yX.xY div.yW > span > span', "innerAttribute": "email" },
                { "name": 'subject', "selector": 'td.xY.a4W div.xT > div.y6 > span > span', "type": "text" },
                { "name": 'date', "selector": 'td.xW.xY > span', "innerAttribute": "title"},
              ]}},
            { "method": "saveOnFile", "params": { "fileName": "gmail-emails", "memoryKey": "emails" } }
            ],
        }
    ];

    const email = process.env.GOOGLE_EMAIL;
    const password = process.env.GOOGLE_PASSWORD;
  
    const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}
    `;

    const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee',} as IAIEmployee);
    
    beforeAll(async () => {
        await browserAgent.seed();
    });

    test('Google login', async () => {
        const result = await browserAgent.executorAgent.invoke({
          input: 'Login on Google',
        });
        console.log(JSON.stringify(result));
    });

    test('List emails on Gmail', async () => {
        const result = await browserAgent.executorAgent.invoke({
          input: 'List emails on Gmail',
        });
        console.log(JSON.stringify(result));
    });
});