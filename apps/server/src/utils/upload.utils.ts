import {
  Bucket,
  File as GoogleCloudFile,
  Storage
} from '@google-cloud/storage';
import crypto from 'crypto';
import fs from 'fs';

export class UploadUtils {
  private _storage: Storage;
  private _bucket: Bucket;

  constructor(bucket = 'cognum-data-sources') {
    if (process.env.PROD === 'true') {
      this._storage = new Storage({
        projectId: 'cognum',
      });
    } else {
      this._storage = new Storage({
        keyFilename: 'cognum.secrets.json',
        projectId: 'cognum',
      });
    }
    this._bucket = this._storage.bucket(bucket);
  }

  private async _convertToJSFile(file: GoogleCloudFile) {
    const { name } = file;
    const buffers = await file.download();
    const data = await file.getMetadata();
    const [metadata] = data;
    const { contentType, updated } = metadata;
    // Concatene os buffers
    const concatenatedBuffer = Buffer.concat(buffers);

    // Converta para string base64
    const base64String = concatenatedBuffer.toString('base64');
    return {
      name,
      contentType,
      data: base64String,
      lastModified: updated,
    };
  }

  /**
   * Uploads a file to Google Cloud Storage and returns its public URL.
   *
   * @param {string} id - The reference ID to the parent (resource owner).
   * @param {Express.Multer.File} file - The file to be uploaded.
   * @param {string} folder - The name of the folder where the file will be stored.
   * @param {string} [filename] - The name of the file to be persisted (optional).
   * @returns {Promise<string>} - The public URL of the uploaded file.
   */
  async uploadFile(
    id: string,
    file: Express.Multer.File,
    folder: string,
    filename?: string
  ): Promise<string> {
    try {
      // Creates a unique hash for the new file name
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname + Date.now())
        .digest('hex');
      const newName = filename || `${hash}_${file.originalname}`;

      // Defines the destination path in Google Cloud Storage
      const destination = `${folder}/${id}/${newName}`;

      // Uploads the file
      await this._bucket.upload(file.path, {
        destination,
        metadata: { 'Cache-Control': 'no-cache' },
      });

      // Gets the reference to the uploaded file
      const upload = await this._bucket.file(destination);

      // Adds read permission for all users (public URL)
      await upload.acl.add({ entity: 'allUsers', role: 'READER' });

      // Deletes the file from local storage
      fs.unlinkSync(file.path);

      // Returns the public URL of the uploaded file
      return `https://storage.googleapis.com/${this._bucket.name}/${destination}`;
    } catch (error) {
      const { errors } = error;
      console.log('An error occurred in upload file: ', { error, errors });
      return '';
    }
  }

  /**
   * Lists all files in a Google Cloud Storage folder with the specified prefix.
   *
   * @param {string} folderPrefix - The folder prefix that will be used to filter the files.
   * @returns {Promise<File[]>} Array of files existing in the folder.
   */
  async listFolderContent(folderPrefix) {
    try {
      const [files] = await this._bucket.getFiles({
        prefix: folderPrefix,
      });

      // Required to remove references to the folder itself
      const filtered = files.filter((arquivo) => !arquivo.name.endsWith('/'));
      // Converting to JavaScript files
      const parsedFiles = await Promise.all(
        filtered.map(async (file) => this._convertToJSFile(file))
      );

      return parsedFiles;
    } catch (error) {
      const { errors } = error;
      console.log('An error occurred while listing files in the folder: ', {
        error,
        errors,
      });
      return error;
    }
  }

  /**
   * Get a file in Google Cloud Storage.
   *
   * @param {string} filePrefix - The file prefix.
   * @returns {Promise<File>} Requested file of exists.
   */
  async getFile(filePrefix) {
    try {
      const data = await this._bucket.file(filePrefix);
      return this._convertToJSFile(data);
    } catch (error) {
      const { errors } = error;
      console.log('An error occurred while retrieving the file', {
        error,
        errors,
      });
      return error;
    }
  }

  /**
   * Deletes the file, if it exists, in Google Cloud Storage.
   *
   * @param {string} filePrefix - The file prefix.
   */
  async deleteFile(filePrefix) {
    try {
      return await this._bucket
        .file(filePrefix)
        .delete({ ignoreNotFound: false });
    } catch (error) {
      const { errors } = error;
      console.log('An error occurred while retrieving the file', {
        error,
        errors,
      });
      throw error;
    }
  }
}

export default new UploadUtils();
