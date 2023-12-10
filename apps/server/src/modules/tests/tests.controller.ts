import { LinkedInService } from '@cognum/tools';
import { Request, Response } from 'express';

class TestsController {

  public async linkedinFindLeads(req: Request, res: Response): Promise<void> {
    try {
      const { auth, query, quantity } = req.body;
      const linkedInService = new LinkedInService();
      await linkedInService.start();
      await linkedInService.login(auth);
      const leads = await linkedInService.findLeads({ query, quantity });
      await linkedInService.stop();
      res.json({ leads });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error logging in' });
    }
  }
}

export default new TestsController();
