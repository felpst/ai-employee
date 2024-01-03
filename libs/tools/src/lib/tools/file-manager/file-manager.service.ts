import { File } from '@google-cloud/storage';
import axios from 'axios';
import {
  IFileManagerOptions,
  IReadOrDeleteFileOptions,
} from './interfaces/file-manager.interfaces';

export class FileManagerService {
  async create() {}
  async update() {}
  async delete() {}

  async read({ aiEmployeeId, filename }: IReadOrDeleteFileOptions) {
    const { data } = await axios.get<File>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}/files/${filename}`
    );
    return data;
  }

  async list({ aiEmployeeId }: IFileManagerOptions): Promise<File[]> {
    const { data } = await axios.get<File[]>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}`
    );
    return data;
  }
}
