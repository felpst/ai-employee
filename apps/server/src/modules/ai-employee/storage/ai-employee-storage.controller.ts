import { AIEmployee } from '@cognum/ai-employee';
import { NextFunction, Request, Response } from 'express';
import UploadUtils from '../../../utils/upload.utils';

export class AiEmployeeStorageController {
  public async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const aiEmployeeId = req.params.id;
      const aiEmployee = await AIEmployee.findOne({ _id: aiEmployeeId });

      if (!aiEmployee) {
        res.status(404).json({ error: 'AIEmployee not found' });
        return;
      }

      if (aiEmployee && !aiEmployee.workspace) {
        res
          .status(400)
          .json({ error: 'AIEmployee is not linked to any workspace' });
        return;
      }
      const path = `workspaces/${aiEmployee.workspace}/ai-employees/${aiEmployee._id}`;
      const list = await UploadUtils.listFolderContent(path);
      res.json(list);
    } catch (error) {
      next(error);
    }
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = req.params.id;
      const filename = req.params.filename;
      const aiEmployee = await AIEmployee.findOne({ _id });

      if (!aiEmployee) {
        res.status(404).json({ error: 'AIEmployee not found' });
        return;
      }

      if (aiEmployee && !aiEmployee.workspace) {
        res
          .status(400)
          .json({ error: 'AIEmployee is not linked to any workspace' });
        return;
      }
      const path = `workspaces/${aiEmployee.workspace}/ai-employees/${aiEmployee._id}/${filename}`;
      const file = await UploadUtils.getFile(path);
      res.json(file);
    } catch (error) {
      next(error);
    }
  }
}

export default new AiEmployeeStorageController();
