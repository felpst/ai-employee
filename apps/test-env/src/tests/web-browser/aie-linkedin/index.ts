import { BrowserAgent } from '@cognum/ai-employee'


export class AIELinkedIn {

  async execute() {
    // const instructions = 'Open LinkedIn page'
    const instructions = `Login on LinkedIn with ${process.env.LINKEDIN_USERNAME} and ${process.env.LINKEDIN_PASSWORD}.`

    const browserAgent = new BrowserAgent()
    await browserAgent.init()
    const result = await browserAgent.call(instructions)
    console.log(result);
  }

}
