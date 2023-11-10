import { AIEmployee } from '@cognum/ai-employee';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';
import UploadUtils from '../../utils/upload.utils';

export class AiEmployeeController extends ModelController<typeof AIEmployee> {
  constructor() {
    super(AIEmployee);
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employeeId = req.params.id;
      const data = req.body;
      data.updatedBy = req['userId'];
      if (req.file?.path) {
        data.avatar = await UploadUtils.uploadFile(
          employeeId,
          req.file,
          'employees'
        );
      }

      const updated = await AIEmployee.findByIdAndUpdate(employeeId, data, {
        returnDocument: 'after',
        runValidators: true,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

export default new AiEmployeeController();
