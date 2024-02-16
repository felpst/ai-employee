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
          "name": "Create a new notebook on Google Colab",
          "description": "Use this to create a new notebook on Google Colab.",
          "inputs": {
            "notebookName": {
              "type": "string",
              "description": "Name of the new notebook."
            }
          },
          "steps": [
            { "method": "loadUrl", "params": { "url": "https://colab.google/" } },
            { "method": "click", "params": { "selector": ".content__ctas a:nth-child(2)", "sleep": 5000 } },
            { "method": "switchToTab", "params": { "index": 1 } },
            { "method": "inputText", "params": { "selector": "#doc-name", "content": "{notebookName}" } },
            { "method": "pressKey", "params": { "key": "Enter", "sleep": 5000  } },
          
          ],
        }

    ];

    const email = process.env.GOOGLE_EMAIL;
    const password = process.env.GOOGLE_PASSWORD;

    const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}
    - Name of the new notebook: Test_notebook.ipynb
    `
    const browserAgent = new BrowserAgent(skills, memory, { _id: 'testEmployeeId'} as IAIEmployee);

    beforeAll(async () => {
        await browserAgent.seed();
    });

    test('Google login', async () => {
        const result = await browserAgent.executorAgent.invoke({
          input: 'Login on Google',
        });
        console.log(JSON.stringify(result));
    });

    test('Create a new notebook on Google Colab', async () => {
        const result = await browserAgent.executorAgent.invoke({
          input: 'Create a new notebook on Google Colab',
        });
        console.log(JSON.stringify(result));
    });
});