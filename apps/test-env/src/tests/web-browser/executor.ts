import { BrowserAgent } from "@cognum/browser";

export class ExecutorTest {
  async execute() {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    console.log(process.env.DB_USER)

    try {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Login on Xandr'
      })
      console.log(result);
    } catch (error) {
      console.error(error);
    }


    // const instructions = [
    //   { method: 'loadUrl', params: { url: 'https://invest.xandr.com/login' } },
    //   { method: 'inputText', params: { selector: '#anxs-login-username', content: "AIEmployee" } },
    //   { method: 'click', params: { selector: '#identity-check-button', sleep: 5000 } },
    //   { method: 'inputText', params: { selector: '#i0116', content: "aiemployee@cognum.ai" } },
    //   { method: 'click', params: { selector: '#idSIButton9', sleep: 5000 } },
    //   { method: 'inputText', params: { selector: '#i0118', content: "gWHT#TDBtw7Z#,@" } },
    //   { method: 'click', params: { selector: '#idSIButton9', sleep: 5000 } },
    //   { method: 'click', params: { selector: '#idSIButton9', sleep: 5000 } },
    // ]

    // for (const instruction of instructions) {
    //   console.log('instruction', JSON.stringify(instruction));

    //   const { method, params } = instruction;
    //   await browserAgent.webBrowser[method](params);
    // }

  }
}
