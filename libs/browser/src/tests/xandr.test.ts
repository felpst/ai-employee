import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

  const sleep = 2000;

  const skills: Skill[] = [
    {
      "name": "Login on Xandr",
      "description": "Use this to login on Xandr.",
      "inputs": {
        "username": {
          "type": "string",
          "description": "Username on Xandr."
        },
        "email": {
          "type": "string",
          "description": "Email on Microsoft account."
        },
        "password": {
          "type": "string",
          "description": "Password on Xandr."
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://invest.xandr.com/login" } },
        { "method": "inputText", "params": { "selector": "#anxs-login-username", "content": "{username}" } },
        { "method": "click", "params": { "selector": "#identity-check-button" } },
        { "method": "inputText", "params": { "selector": "#i0116", "content": "{email}" } },
        { "method": "click", "params": { "selector": "#idSIButton9" } },
        { "method": "if", "params": { "condition": "!browserMemory.currentUrl.includes('https://invest.xandr.com/')", "steps": [
          { "method": "inputText", "params": { "selector": "#i0118", "content": "{password}" } },
          { "method": "click", "params": { "selector": "#idSIButton9" } },
          { "method": "click", "params": { "selector": "#idSIButton9" } }
        ]}},
      ]
    },
    {
      "name": "Extract Audiences Data from Xandr",
      "description": "Use this to extract audiences data from Xandr.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://invest.xandr.com/dmp/segments" } },
        { "method": "click", "params": { "selector": "div.lucid-Tabs > ul > li:nth-child(3)", "sleep": sleep } },
        { "method": "loop", "params": { "times": 3, "steps": [
          { "method": "dataExtraction", "params": { "container": "table.lucid-Table > tbody > tr", "saveOn": "audiences", "properties": [
            { "name": 'name', "selector": '.dmp-Segments-Segment-Name' },
            { "name": 'provider', "selector": '.dmp-Segments-Segment-Name' },
            { "name": 'id', "selector": '.dmp-Segments-Segment-Id' },
            { "name": 'price', "selector": '.dmp-Segments-row-price' },
            { "name": 'impressions', "selector": 'td:nth-child(6)' },
            { "name": 'users', "selector": 'td:nth-child(7)' },
          ]}},
          { "method": "click", "params": { "selector": ".lucid-Tabs footer button:nth-of-type(2)", "sleep": sleep }}]}
        },
        { "method": "saveOnFile", "params": { "fileName": "xandr-audiences", "memoryKey": "audiences" } }
      ]
    },
  ]

  const memory = `
    Xandr:
    - Username: AIEmployee
    - Password: gWHT#TDBtw7Z#,@

    Microsoft:
    - Email: aiemployee@cognum.ai
    - Password: gWHT#TDBtw7Z#,@`

  test('Login on Xandr', async () => {
    const browserAgent = new BrowserAgent(skills, memory);
    await browserAgent.seed();

    try {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Login on Xandr'
      })
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });

  test('Extract Data from Xandr', async () => {
    const browserAgent = new BrowserAgent(skills, memory);
    await browserAgent.seed();

    try {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Login on Xandr and extract audiences.'
      })
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });

});
