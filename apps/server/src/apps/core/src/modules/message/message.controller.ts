import { Message } from '@cognum/models';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class MessageController extends ModelController<typeof Message> {
  constructor() {
    super(Message);
  }

  public async addFeedback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const messageId: string = req.params.id;
      const userId = req['userId'];
      const { feedbacks } = req.body;
      if (!feedbacks) {
        const error: any = new Error('Feedback not sent');
        error.status = 400;
        throw error;
      }
      const _feedbacks = Array.isArray(feedbacks) ? feedbacks : [feedbacks];
      const data = _feedbacks.map((feedback) => ({
        ...feedback,
        createdBy: userId,
      }));
      const updated = await Message.findOneAndUpdate(
        { _id: messageId },
        { $push: { feedbacks: data } },
        {
          returnDocument: 'after',
          runValidators: true,
          upsert: true,
          new: true,
        }
      );

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  public async updateFeedback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const messageId: string = req.params.id;
      const feedbackId: string = req.params.feedbackId;
      const message = Message.findById(messageId);
      if (!message) {
        const error: any = new Error('Message not found');
        error.status = 404;
        throw error;
      }
      const _feedbacks = (await message).feedbacks;
      const feedbacks = _feedbacks.map((feedback) =>
        feedback._id.toString() === feedbackId
          ? { ...feedback.toObject(), ...req.body }
          : feedback
      );
      const updated = await Message.findOneAndUpdate(
        { _id: messageId },
        { $set: { feedbacks } },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      );

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
