import { File } from '@google-cloud/storage';
import { FileManagerService } from './file-manager.service';
import {
  IFileManager,
  IFileManagerOptions,
  IReadOrDeleteFileOptions,
} from './interfaces/file-manager.interfaces';

export class FileManager implements IFileManager {
  private _service: FileManagerService;

  constructor() {
    this._service = new FileManagerService();
  }

  async create(
    options: IFileManagerOptions & { filePath: string }
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async read(options: IReadOrDeleteFileOptions): Promise<any> {
    return this._service.read(options);
  }

  async update(options: IFileManagerOptions): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async list(options: IFileManagerOptions): Promise<File[]> {
    return this._service.list(options);
  }
}
