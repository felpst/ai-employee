import { BrowserAgent, Skill } from "@cognum/browser";

export class ExecutorTest {
  async execute() {
    // TODO Load from database all skills
    const skills: Skill[] = [
      this.loginOnXandr
    ]

    // TODO Get memory from database
    const memory = `
    Xandr:
    - Username: AIEmployee
    - Password: gWHT#TDBtw7Z#,@

    Microsoft:
    - Email: aiemployee@cognum.ai
    - Password: gWHT#TDBtw7Z#,@`

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
  }

  get loginOnXandr(): Skill {
    return {
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
        { "method": "click", "params": { "selector": "#identity-check-button", "sleep": 5000 } },
        { "method": "inputText", "params": { "selector": "#i0116", "content": "{email}" } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 5000 } },
        { "method": "inputText", "params": { "selector": "#i0118", "content": "{password}" } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 5000 } },
        { "method": "click", "params": { "selector": "#idSIButton9", "sleep": 5000 } }
      ]
    }

  }
}
