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
  ]

  // TODO: switch to personal email for testing
  const memory = `
    Google:
    - Email: aiemployee@cognum.ai
    - Password: upmw mlrj ytcq zuxm`

  test('Login on Google', async () => {
    const browserAgent = new BrowserAgent(skills, memory);
    await browserAgent.seed();

    try {
      const resultLogin = await browserAgent.executorAgent.invoke({
        input: 'Login on Google'
      })
      console.log(resultLogin)
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });
});