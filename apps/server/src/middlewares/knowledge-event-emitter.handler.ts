import { NextFunction, Request, Response } from "express";
import knowledgeOperationEventEmitter from '../helpers/knowledge-events.helper';

function knowledgeEventEmitterHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    function emit(eventName: string) {
      knowledgeOperationEventEmitter.emit(eventName, res.locals.data)
    }

    switch (req.method) {
      case 'POST':
        emit('create')
        break;
      case 'PUT':
        emit('update')
        break;
      case 'DELETE':
        emit('delete')
        break;
    }
  })

  next()
}

export default knowledgeEventEmitterHandler;
