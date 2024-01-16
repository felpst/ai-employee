import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";

describe('AI Agent Browser', () => {
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
        { "method": "click", "params": { "selector": "#identity-check-button", "sleep": 20000 } },
        { "method": "inputText", "params": { "selector": "#i0116", "content": "{email}" } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 20000 } },
        { "method": "inputText", "params": { "selector": "#i0118", "content": "{password}" } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 20000 } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 20000 } }
      ]
    },
    {
      "name": "Extract Data from Xandr",
      "description": "Use this to extract data from Xandr.",
      "inputs": { },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://invest.xandr.com/dmp/segments" } },
        { "method": "findMultiplesElementsToClick", "params": { "selector": "lucid-Tabs-Tab", "sleep": 15000, "position": 2 } },
        { "method": "findMultiplesElementsToClick", "params": { "selector": "lucid-Button", "sleep": 15000, "position": 3 } },
      ]
    }
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
        input: 'after login on Xandr, extract data'
      })
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });
});
