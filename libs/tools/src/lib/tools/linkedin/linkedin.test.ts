import 'dotenv/config';
import { ILinkedInAuth } from './linkedin.interfaces';
import { LinkedInService } from './linkedin.service';

describe('LinkedIn Test', () => {
  jest.setTimeout(300000)

  const auth: ILinkedInAuth = {
    user: process.env.LINKEDIN_USERNAME,
    password: process.env.LINKEDIN_PASSWORD
  }
  const linkedInService = new LinkedInService();

  beforeAll(async () => {
    await linkedInService.start();
  });

  it('should login', async () => {
    const isAuthenticaded = await linkedInService.login(auth);
    expect(isAuthenticaded).toBe(true);
  })

  it('should find leads', async () => {
    await linkedInService.login(auth);
    const leads = await linkedInService.findLeads({ query: 'Web Developers in Brazil', quantity: 30 });
    console.log(leads);
    console.log(leads.length);
    expect(leads.length).toBeGreaterThan(0);
  })

  afterAll(async () => {
    await linkedInService.stop();
  });

});
