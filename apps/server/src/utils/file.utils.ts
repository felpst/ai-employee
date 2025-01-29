export class FileUtils {
  // Define the file filter to accept only specific file types if needed
  getAcceptedFileType() {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream',
    ];
  }

  getFileType(fileName: string): string {
    return fileName.split('.').pop() || '';
  }
}

export default new FileUtils();
