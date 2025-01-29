import { LinkedInService } from '@cognum/tools';
import { Request, Response } from 'express';
class TestsController {

  public async linkedinFindLeads(req: Request, res: Response, next: any): Promise<void> {
    try {
      const { auth, query, quantity } = req.body;
      const linkedInService = new LinkedInService();
      await linkedInService.start('chrome');
      await linkedInService.login(auth);
      const leads = await linkedInService.findLeads({ query, quantity });
      res.json({ leads });
      await linkedInService.stop();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error logging in' });
    }
  }
}

export default new TestsController();
