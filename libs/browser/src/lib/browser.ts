import { WebBrowser } from "./utils/web-browser";
import { BrowserExecutorAgent } from './agents/executor.agent'
import { Skill } from "./browser.interfaces";
import { IAIEmployee } from "@cognum/interfaces";

export class BrowserAgent {
  webBrowser = new WebBrowser()
  executorAgent: BrowserExecutorAgent;

  constructor(
    private skills?: Skill[],
    private memory: String = '',
    private aiEmployee?: IAIEmployee
  ) {}

  async seed() {
    await this.webBrowser.open({ aiEmployeeId: this.aiEmployee?._id });

    this.executorAgent = new BrowserExecutorAgent(this.webBrowser, this.skills, this.memory)
    await this.executorAgent.seed();

    console.log('BrowserAgent seeded');
  }


}
