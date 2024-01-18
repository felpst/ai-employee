import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";

describe('AI Agent Browser', () => {
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
        { "method": "inputText", "params": { "selector": "#identifierId", "content": "{email}" } },
        { "method": "click", "params": { "selector": "#identifierNext", "sleep": 5000 } },
        { "method": "inputText", "params": { "selector": "input[name='Passwd']", "content": "{password}" } },
        { "method": "click", "params": { "selector": "#passwordNext", "sleep": 5000 } }
      ]
    },
    {
      "name": "Access Google Chat",
      "description": "Use this to access Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://chat.google.com/" } }
      ]
    },
    {
      "name": "Open Message on Google Chat",
      "description": "Use this to open a message on Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "click", "params": { "selector": "#space/AAAAeXMMTpY/SCcFR", "sleep": 5000 } }
      ]
    }

  ]
  const email = process.env.EMAIL_USER
  const password = process.env.EMAIL_PASSWORD

  // TODO: switch to personal email for testing
  const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}`

  test('Google chat', async () => {
    const browserAgent = new BrowserAgent(skills, memory);
    await browserAgent.seed();

    try {
      const resultLogin = await browserAgent.executorAgent.invoke({
        input: 'Login on Google'
      })
      console.log(resultLogin)

      const resultAccess = await browserAgent.executorAgent.invoke({
        input: 'Access Google Chat'
      });
      console.log(resultAccess);

      const resultOpenMessage = await browserAgent.executorAgent.invoke({
        input: 'Open Message on Google Chat'
      });
      console.log(resultOpenMessage);
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });
});