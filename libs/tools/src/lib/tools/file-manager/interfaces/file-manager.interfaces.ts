import { File } from '@google-cloud/storage';
import { Schema } from 'mongoose';

export type IFileManagerOptions = {
  aiEmployeeId: string | Schema.Types.ObjectId;
};

export type IReadOrDeleteFileOptions = IFileManagerOptions & {
  filename: string;
};

export type ICreateFileOptions = IFileManagerOptions & {
  filePath: string;
};

export type IUpdateFileOptions = IFileManagerOptions & {
  filename: string;
  filePath: string;
};

export interface IFileManager {
  create(options: ICreateFileOptions): Promise<any>;
  read(options: IReadOrDeleteFileOptions): Promise<any>;
  update(options: IUpdateFileOptions): Promise<any>;
  list(options: IFileManagerOptions): Promise<File[]>;
  delete(options: IReadOrDeleteFileOptions): Promise<void>;
}
