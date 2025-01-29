import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.is('application/json')) {
    return next();
  }
  if (req.is('multipart/form-data')) {
    const json = req.body.json;
    if (json === undefined) {
      return res.status(400).json({
        error: ['missing required "json" part for multipart/form-data'],
      });
    }
    try {
      req.body = JSON.parse(req.body.json);
      return next();
    } catch (err: any) {
      res.status(400).json({ error: [err.message] });
    }
  }
  return res.status(400).json({ error: ['invalid content-type'] });
};
