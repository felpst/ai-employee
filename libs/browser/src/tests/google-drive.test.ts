import 'dotenv/config';
import { IAIEmployee } from "@cognum/interfaces";
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";

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
      "name": "List Folders on Google Drive",
      "description": "Use this to list Folders on Google Drive.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://drive.google.com/" } },
        { "method": 'click', "params": { "selector": "div.PjVfac.OOxkGf > div.YAetr.UFlFNc > div > div:nth-child(2) > button", "sleep": 10000 } },
        { "method": "dataExtraction", "params": { "container": "div.WYuW0e", "saveOn": "folders", "properties": [
          { "name": 'id', "attribute": 'data-id', "required": true },
          { "name": 'name', "selector": 'div.KL4NAf', "required": true },
        ]}},
        { "method": "switchToDefaultContent" },
        { "method": "saveOnFile", "params": { "fileName": "google-documents-folders", "memoryKey": "folders" } }
      ],
      "successMessage": "Google Documents available folders: {folders}."
    },
    {
      "name": "Open Folder on Google Drive",
      "description": "Use this to open a folder on Google Drive.",
      "inputs": {
        "folderId": {
          "type": "string",
          "description": "Folder ID"
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://drive.google.com/" } },
        { "method": 'click', "params": { "selector": "div.PjVfac.OOxkGf > div.YAetr.UFlFNc > div > div:nth-child(2) > button", "sleep": 10000 } },
        { "method": "loadUrl", "params": { "url": "https://drive.google.com/drive/folders/{folderId}" }, "successMessage": "Folder selected: {folderId}." },
      ]
    },
    {
      "name": "List Files in Folders on Google Drive",
      "description": "Use this to list files in folders on Google Drive.",
      "inputs": {
        "folderId": {
          "type": "string",
          "description": "Folder ID"
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://drive.google.com/" } },
        { "method": 'click', "params": { "selector": "div.PjVfac.OOxkGf > div.YAetr.UFlFNc > div > div:nth-child(2) > button", "sleep": 10000 } },
        { "method": "loadUrl", "params": { "url": "https://drive.google.com/drive/folders/{folderId}" }, "successMessage": "Folder selected: {folderId}." },
        { "method": "dataExtraction", "params": { "container": "div.WYuW0e", "saveOn": "folders", "properties": [
          { "name": 'id', "attribute": 'data-id', "required": true },
          { "name": 'name', "selector": 'div.KL4NAf', "required": true },
        ]}},
        { "method": "switchToDefaultContent" },
        { "method": "saveOnFile", "params": { "fileName": "google-documents-folders", "memoryKey": "folders" } }
      ],
    }

  ]
  const email = process.env.GOOGLE_EMAIL
  const password = process.env.GOOGLE_PASSWORD

  const memory = `
  Google:
  - Email: ${email}
  - Password: ${password}
  `

  const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Google login', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Login on Google'
    })
    console.log(JSON.stringify(result))
  });

  test('List Folders', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'List folders on Google Drive'
    })
    console.log(JSON.stringify(result))
  });

  test('Open Folder', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Open Isso é um teste Folder on Google Drive'
    })
    console.log(JSON.stringify(result))
  });

  test('List Files', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'List files in Teste Folder on Google Drive'
    })
    console.log(JSON.stringify(result))
  });

})
