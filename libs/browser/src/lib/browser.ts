import { WebBrowser } from "./utils/web-browser";
import { BrowserExecutorAgent } from './agents/executor.agent';
import { Skill } from "./browser.interfaces";
import { IAIEmployee } from "@cognum/interfaces";
import { BrowserAdaptatorAgent } from './agents/adaptator.agent';

export class BrowserAgent {
  webBrowser = new WebBrowser();
  executorAgent: BrowserExecutorAgent;
  adaptatorAgent: BrowserAdaptatorAgent;

  constructor(
    private skills?: Skill[],
    private memory: String = '',
    private aiEmployee?: IAIEmployee
  ) { }

  async seed() {
    await this.webBrowser.open({ aiEmployeeId: this.aiEmployee?._id });

    this.executorAgent = new BrowserExecutorAgent(this.webBrowser, this.skills, this.memory);
    await this.executorAgent.seed();

    this.adaptatorAgent = new BrowserAdaptatorAgent(this.webBrowser, this.memory);
    await this.adaptatorAgent.seed();

    console.log('BrowserAgent seeded');
  }


}
