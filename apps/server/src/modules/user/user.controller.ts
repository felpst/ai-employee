/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Token, User } from '@cognum/models';
import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import { EmailService } from '../../services/email.service';
import { confirmPasswordResetEmailTemplate } from '../../utils/templates/confirm-reset-password';
import { registerEmailTemplate } from '../../utils/templates/register';
import { passwordResetEmailTemplate } from '../../utils/templates/reset-password';

export class UserController extends ModelController<typeof User> {
  constructor() {
    super(User);
  }

  public async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sort = (req.query.sort as string) || [];
      const list = await User.find().sort(sort).select('-password');
      res.json(list);
    } catch (error) {
      next(error);
    }
  }

  public async sendEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    req.body.email = req.body.email.toLowerCase();
    req.body.active = true;

    try {
      await EmailService.send({
        to: req.body.email,
        subject: 'Welcome to Cognum!',
        html: registerEmailTemplate,
      })
    } catch (error) {
      next(error)
    }

    next();
  }

  public async resendTokenRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokenId = req.params.tokenId;
      const { email } = req.body;
      const expiresIn = new Date();
      expiresIn.setMinutes(expiresIn.getMinutes() + 30);
      const token = await Token.findById(tokenId);
      const user = await User.findOne({ email });
      let doc = null;
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();
      if (!token || (token && token.used)) {
        doc = await Token.create({
          expiresIn,
          user,
          used: false,
          token: newToken,
        });
      } else {
        doc = await Token.findOneAndUpdate(
          { _id: token._id },
          { $set: { expiresIn, token: newToken } },
          {
            returnDocument: 'after',
            runValidators: true,
          }
        );
      }
      const html = registerEmailTemplate.replace('{{token}}', doc.token);
      await EmailService.send({
        to: email,
        subject: 'Cognum - Register',
        html,
      })
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  public async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const now = new Date();
      const tokenId = req.params.tokenId;
      const { token } = req.body;
      const expiresIn = new Date();
      expiresIn.setMinutes(expiresIn.getMinutes() + 30);
      const _token = await Token.findOne({ _id: tokenId, token });
      if (!_token) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }
      const tokenData = _token.toObject();

      // @ts-ignore
      const expired = now.getTime() > new Date(_token.expiresIn).getTime();
      if (tokenData.used || expired) {
        res.status(400).json({ error: 'Used or expired token' });
        return;
      }

      const user = await User.findById(tokenData.user);
      if (user.active) {
        res.status(400).json({
          error: 'User is already active in the system, proceed to login',
        });
        return;
      }

      await User.findByIdAndUpdate(user._id, { $set: { active: true } });
      await Token.findByIdAndUpdate(_token._id, { $set: { used: true } });

      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  public async recoveryRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const expiresIn = new Date();
      expiresIn.setMinutes(expiresIn.getMinutes() + 15);
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ error: 'No users found with email' });
        return;
      }
      const recoveries = await Token.find({ user: user._id })
        .sort({ createdAt: 'desc' })
        .limit(1);
      const lastRecovery =
        recoveries && recoveries.length ? recoveries[0] : null;
      let doc = null;
      if (!lastRecovery || (lastRecovery && lastRecovery.used)) {
        doc = await Token.create({ expiresIn, user: user._id });
      } else {
        doc = await Token.findOneAndUpdate(
          { _id: lastRecovery._id },
          { $set: { expiresIn } },
          {
            returnDocument: 'after',
            runValidators: true,
          }
        );
      }
      const link = `${process.env.APP_URL}/auth/recovery/${doc._id}`;
      const html = passwordResetEmailTemplate
        .replace('{{name}}', user.name)
        .replace('{{link}}', link);
      await EmailService.send({
        to: email,
        subject: 'Password reset',
        html,
      })
      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  public async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const now = new Date();
      const tokenId: string = req.params.tokenId;
      const recovery = await Token.findById(tokenId);
      if (!recovery) {
        res.status(404).json({ error: 'Recovery token not found' });
        return;
      }
      const _recovery = recovery.toObject();
      // @ts-ignore
      const expired = now.getTime() > new Date(_recovery.expiresIn).getTime();
      if (_recovery.used || expired) {
        res.json({ isValid: false });
        return;
      }
      const user = await User.findById(_recovery.user);
      res.json({ isValid: true, email: user.email });
      return;
    } catch (error) {
      next(error);
    }
  }

  public async recovery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const now = new Date();
      const recoveryId: string = req.params.recoveryId;
      const { password } = req.body;
      const recovery = await Token.findById(recoveryId);
      if (!recovery) {
        res.status(404).json({ error: 'Recovery token not found' });
        return;
      }
      const _recovery = recovery.toObject();
      // @ts-ignore
      const expired = now.getTime() > new Date(_recovery.expiresIn).getTime();
      if (_recovery.used) {
        res.status(400).json({ error: 'Recovery token already used' });
        return;
      }
      if (expired) {
        res.status(400).json({ error: 'Recovery token already expired' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { _id: _recovery.user },
        { $set: { password: hashedPassword, active: true } }
      );

      // Envie um e-mail de confirmação de alteração de senha
      const user = await User.findById(_recovery.user);
      const email = user.email;
      const html = confirmPasswordResetEmailTemplate.replace(
        '{{name}}',
        user.name
      );

      await EmailService.send({
        to: email,
        subject: 'Password Changed Successfully',
        html,
      })

      await Token.findOneAndUpdate(
        { _id: _recovery._id },
        { $set: { used: true } }
      );

      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
