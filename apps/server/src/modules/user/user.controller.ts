/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Recovery, User } from '@cognum/models';
import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import emailEmitter from '../../utils/email.utils';
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

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const _name = name.toUpperCase();
      const user = await User.create({
        name: _name,
        email,
        password,
      });
      emailEmitter.emit('sendEmail', {
        to: email,
        subject: 'Welcome to Cognum!',
        text: "Welcome to COGNUM. Let's go together in search of a promising future with AI's. This is an automatic email from the system, you do not need to respond to it.",
      });
      const { password: _passwd, ...rest } = user.toObject();
      res.status(201).json(rest);
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
        res.status(404).json({ error: 'No user registered with email' });
        return;
      }
      const recoveries = await Recovery.find({ user: user._id })
        .sort({ createdAt: 'desc' })
        .limit(1);
      const lastRecovery =
        recoveries && recoveries.length ? recoveries[0] : null;
      let doc = null;
      if (!lastRecovery || (lastRecovery && lastRecovery.used)) {
        doc = await Recovery.create({ expiresIn, user: user._id });
      } else {
        doc = await Recovery.findOneAndUpdate(
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
      emailEmitter.emit('sendEmail', {
        to: email,
        subject: 'Password reset',
        html,
      });
      res.status(201).json();
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
      const recovery = await Recovery.findById(recoveryId);
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
        { $set: { password: hashedPassword } }
      );
      await Recovery.findOneAndUpdate(
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
