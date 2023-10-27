import { Bucket, Storage } from '@google-cloud/storage';
import crypto from 'crypto';
import fs from 'fs';

export class UploadUtils {
  private _storage: Storage;
  private _bucket: Bucket;

  constructor(bucket = 'cognum-data-sources') {
    this._storage = new Storage({
      keyFilename: 'cognum.secrets.json',
      projectId: 'cognum',
    });
    this._bucket = this._storage.bucket(bucket);
  }

  // Upload file to Google Storage bucket
  async uploadFile(id: string, file: Express.Multer.File, folder: string) {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname + Date.now())
        .digest('hex');
      const newName = `${hash}_${file.originalname}`;
      const destination = `${folder}/${id}/${newName}`;
      await this._bucket.upload(file.path, { destination });
      const upload = await this._bucket.file(destination);
      await upload.acl.add({ entity: 'allUsers', role: 'READER' });

      // delete file from local storage
      fs.unlinkSync(file.path);

      return `https://storage.googleapis.com/${this._bucket.name}/${destination}`;
    } catch (error) {
      const { errors } = error;
      console.log('An error ocurring in upload file: ', { error, errors });
      return '';
    }
  }
}

export default new UploadUtils();
