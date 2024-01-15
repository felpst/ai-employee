import { WebBrowser } from "./utils/web-browser";
import { BrowserExecutorAgent } from './agents/executor.agent'

export class BrowserAgent {
  webBrowser = new WebBrowser()
  executorAgent: BrowserExecutorAgent;

  async seed() {
    await this.webBrowser.open();
    console.log('X');


    this.executorAgent = new BrowserExecutorAgent()
    await this.executorAgent.seed();

    console.log('BrowserAgent seeded');
  }


}
