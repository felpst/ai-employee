import { AIEmployee } from '@cognum/ai-employee';
import { NextFunction, Request, Response } from 'express';
import UploadUtils from '../../../utils/upload.utils';

export class AiEmployeeStorageController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = req.params.id;
      const file = req.file;
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

      if (!file) {
        res
          .status(400)
          .json({ error: 'You must send a file to perform this action!' });
        return;
      }

      console.log({ workspace: aiEmployee.workspace });

      const upload = await UploadUtils.uploadFile(
        aiEmployee._id,
        file,
        `workspaces/${aiEmployee.workspace}/ai-employees`
      );
      res.json(upload);
    } catch (error) {
      next(error);
    }
  }

  public async read(
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

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = req.params.id;
      const file = req.file;
      const { filename } = req.body;
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

      if (!file) {
        res
          .status(400)
          .json({ error: 'You must send a file to perform this action!' });
        return;
      }

      const upload = await UploadUtils.uploadFile(
        aiEmployee._id,
        file,
        `workspaces/${aiEmployee.workspace}/ai-employees`,
        filename
      );
      res.json(upload);
    } catch (error) {
      next(error);
    }
  }

  public async delete(
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
      await UploadUtils.deleteFile(path);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

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
}

export default new AiEmployeeStorageController();
