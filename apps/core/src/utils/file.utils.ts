export class FileUtils {
  getFileType(fileName: string): string {
    return fileName.split(".").pop() || "";
  }
}

export default new FileUtils();
