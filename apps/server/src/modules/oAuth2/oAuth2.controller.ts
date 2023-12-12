import { Request, Response } from 'express';
import OAuth2Service from './oAuth2.service';

class OAuth2Controller {

  public async googleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const scope = req.query.scope as string;
      const authUrl = OAuth2Service.googleAuthUrl(scope);
      console.log('Auth URL:', authUrl);
      res.json({ authUrl });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error logging in' });
    }
  }

  public async getToken(req: Request, res: Response): Promise<void> {
    try {
      const code = req.query.code as string;
      const { tokens } = await OAuth2Service.getToken(code);
      console.log('Access Token:', tokens.access_token);
      res.status(200).json({ accessToken: tokens.access_token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export default new OAuth2Controller();
