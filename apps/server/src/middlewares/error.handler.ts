import { NextFunction, Request, Response } from "express";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (error.name) {
    case 'ValidationError':
      return res.status(500).json({ errors: Object.values(error.errors).map((val: any) => val.message) });
    case 'CastError':
      return res.status(500).json({ error: `${error.path} is invalid id reference.` });
    default:
      // console.log(error);      
      return res.status(500).json({ error: error.message });
  }
}

export default errorHandler;
