import { BrowserAgent } from '@cognum/ai-employee'


export class AIELinkedIn {

  async execute() {
    // const instructions = 'Open LinkedIn page'
    // const instructions = `
    // Do this steps:
    // 1. Login on LinkedIn with ${process.env.LINKEDIN_USERNAME} and ${process.env.LINKEDIN_PASSWORD}.
    // 2. In Global Search, Search for "Web Developer in Brazil" and press enter.
    // 4. Filter by People only.
    // 3. Click next page.
    // 4. Extract data of the results.
    // `
    const instructions = `LinkedIn Credentials: ${process.env.LINKEDIN_USERNAME} ${process.env.LINKEDIN_PASSWORD}.\nGo to LinkedIn and Search Web Developers from Brazil`

    const browserAgent = new BrowserAgent()
    await browserAgent.init()
    const result = await browserAgent.call(instructions)
    console.log(result);
  }

}
