import { Schema } from 'mongoose';

export type IFileResponse = {
  data: string;
  contentType: string;
  lastModified: Date;
  name: string;
};

export type IFileManagerOptions = {
  aiEmployeeId: string | Schema.Types.ObjectId;
};

export type IReadOrDeleteFileOptions = IFileManagerOptions & {
  filename: string;
};

export type ICreateFileOptions = IFileManagerOptions & {
  file: File;
};

export type IUpdateFileOptions = IFileManagerOptions & {
  filename: string;
  file: File;
};

export interface IFileManager {
  create(options: ICreateFileOptions): Promise<string>;
  read(options: IReadOrDeleteFileOptions): Promise<IFileResponse>;
  update(options: IUpdateFileOptions): Promise<string>;
  list(options: IFileManagerOptions): Promise<IFileResponse[]>;
  delete(options: IReadOrDeleteFileOptions): Promise<boolean>;
}
