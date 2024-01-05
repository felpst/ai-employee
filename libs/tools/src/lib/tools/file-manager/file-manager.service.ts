import { File } from '@google-cloud/storage';
import axios from 'axios';
import {
  ICreateFileOptions,
  IFileManagerOptions,
  IReadOrDeleteFileOptions,
  IUpdateFileOptions,
} from './interfaces/file-manager.interfaces';

export class FileManagerService {
  async create({ aiEmployeeId, file }: ICreateFileOptions) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axios.post<string>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  }

  async read({
    aiEmployeeId,
    filename,
  }: IReadOrDeleteFileOptions): Promise<File> {
    const { data } = await axios.get<File>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}/files/${filename}`
    );

    return data;
  }

  async update({ aiEmployeeId, file, filename }: IUpdateFileOptions) {
    const formData = new FormData();
    const json = { filename };
    formData.append('file', file);
    formData.append('json', JSON.stringify(json));
    const { data } = await axios.put<string>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  }

  async delete({ aiEmployeeId, filename }: IReadOrDeleteFileOptions) {
    try {
      await axios.delete(
        `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}/files/${filename}`
      );
      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }

  async list({ aiEmployeeId }: IFileManagerOptions): Promise<File[]> {
    const { data } = await axios.get<File[]>(
      `${process.env.SERVER_URL}/employees/storage/${aiEmployeeId}`
    );
    return data;
  }
}
