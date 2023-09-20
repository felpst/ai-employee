import { User } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import EmailUtils from '../../utils/email.utils';

export class UserController extends ModelController<typeof User> {
  constructor() {
    super(User);
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
      await EmailUtils.sendMail({
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
}

export default new UserController();
