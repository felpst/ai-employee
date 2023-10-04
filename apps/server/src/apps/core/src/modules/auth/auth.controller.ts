import { Company, User } from '@cognum/models';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id, companyId: user?.company || null },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: '14d' }
      );

      const { password: passwd, ..._user } = user.toObject();
      const expires = new Date();
      expires.setDate(expires.getDate() + 14);
      AuthController._setTokenCookie(res, token, expires);
      res.setHeader('X-Auth-Token', token);
      res.json(_user);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: 'Error logging in' });
    }
  }

  public async protected(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;

      if (!token) {
        res.status(403).json({ error: 'Invalid token' });
        return;
      }

      const decodedToken: any = jwt.verify(token, process.env.AUTH_SECRET_KEY);

      const userId = decodedToken.userId;
      const user = await User.findById(userId).select('name email');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const companyId = decodedToken.companyId;
      user.company = companyId;
      const company = companyId
        ? await Company.findById(companyId).select('name')
        : null;

      res.json({ user, company, token });
    } catch (error) {
      res.status(403).json({ error: 'Invalid token' });
    }
  }

  private static _setTokenCookie(res: Response, token: string, expires: Date) {
    res.cookie('token', token, {
      httpOnly: process.env.PROD === 'true',
      secure: true,
      sameSite: 'none',
      // sameSite: process.env.PROD === 'true' ? 'strict' : 'none',
      expires,
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    AuthController._setTokenCookie(res, '', new Date());
    res.status(200).json({ message: 'Logged out!' });
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      const user = await User.findById(userId).select('-password');

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      delete user.password;

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving user' });
    }
  }

  public async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;

      if (!email) {
        res.status(400).json({ error: 'No email sent' });
        return;
      }

      const user = await User.findOne({ email }).select('email');

      if (!user) {
        res.status(404).json({ error: 'No user registered with email' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving user' });
    }
  }
}

export default new AuthController();
