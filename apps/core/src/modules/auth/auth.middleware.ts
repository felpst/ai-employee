import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    // set request token
    req['token'] = token;
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET_KEY);

    // set request userId
    (req as any).userId = (decodedToken as any).userId;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
}
