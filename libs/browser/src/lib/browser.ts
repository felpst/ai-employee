import { WebBrowser } from "./utils/web-browser";
import { BrowserExecutorAgent } from './agents/executor.agent'
import { Skill } from "./browser.interfaces";

export class BrowserAgent {
  webBrowser = new WebBrowser()
  executorAgent: BrowserExecutorAgent;

  constructor(
    private skills?: Skill[],
    private memory: String = ''
  ) {}

  async seed() {
    await this.webBrowser.open();

    this.executorAgent = new BrowserExecutorAgent(this.webBrowser, this.skills, this.memory)
    await this.executorAgent.seed();

    console.log('BrowserAgent seeded');
  }


}
