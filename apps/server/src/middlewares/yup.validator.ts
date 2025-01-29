import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'yup';

export default (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.validateSync(req, { strict: true, abortEarly: false });
      return next();
    } catch (err: any) {
      return res.status(400).json({ errors: err.errors });
    }
  };
};
