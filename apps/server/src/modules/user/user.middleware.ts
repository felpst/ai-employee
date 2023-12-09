import { RepositoryHelper } from '@cognum/helpers';
import { User } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';

export async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).userId;
    if (!userId) { return next({ error: 'Invalid user id' }) }

    const user = await new RepositoryHelper(User).getById(userId);
    if (!userId) { return next({ error: 'User not found' }) }

    // set request userId
    (req as any).user = user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
}
