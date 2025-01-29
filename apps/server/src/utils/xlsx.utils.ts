import * as xlsx from "xlsx"

interface ISheetDescription {
  sheetName: string;
  rowCount: number;
  firstFiveRows: any[][];
}

export class xlsxUtils {

  getFileOverview(filePath: string): ISheetDescription[] {
    const workbook = xlsx.readFile(filePath);
    const overview: ISheetDescription[] = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      const rowCount = jsonData.length;
      const firstFiveRows: any = jsonData.slice(0, 5);

      overview.push({
        sheetName,
        rowCount,
        firstFiveRows,
      });
    }
    return overview;
  }
}

export default new xlsxUtils();
