import { FileManagerService } from './file-manager.service';
import {
  ICreateFileOptions,
  IFileManager,
  IFileManagerOptions,
  IFileResponse,
  IReadOrDeleteFileOptions,
  IUpdateFileOptions,
} from './interfaces/file-manager.interfaces';

export class FileManager implements IFileManager {
  private _service: FileManagerService;

  constructor() {
    this._service = new FileManagerService();
  }

  async create(options: ICreateFileOptions) {
    return this._service.create(options);
  }

  async read(options: IReadOrDeleteFileOptions): Promise<IFileResponse> {
    return this._service.read(options);
  }

  async update(options: IUpdateFileOptions) {
    return this._service.update(options);
  }

  async delete(options: IReadOrDeleteFileOptions): Promise<boolean> {
    return this._service.delete(options);
  }

  async list(options: IFileManagerOptions): Promise<IFileResponse[]> {
    return this._service.list(options);
  }
}
