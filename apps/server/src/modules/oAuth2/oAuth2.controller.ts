import { Request, Response } from 'express';
import OAuth2Service from './oAuth2.service';

class OAuth2Controller {

    public async getAuthUrl(req: Request, res: Response): Promise<void> {
        try {
            const authUrl = OAuth2Service.getAuthUrl();
            console.log('Auth URL:', authUrl);

            res.redirect(authUrl);
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

            res.send('Token Success! You can close this window.');
        } catch (error) {
            console.error('Token Error:', error);
            res.status(500).send('One error is ocurred');
        }
    }
}

export default new OAuth2Controller();