import 'dotenv/config';
import { FileManager } from '../file-manager';

describe('File management test', () => {
  const manager = new FileManager();

  it('List all files stored by AiEmployee', async () => {
    const result = await manager.list({
      aiEmployeeId: '655392ae1d53c10df51872b1',
    });

    expect(result).toHaveLength(1);
  });

  it('Get a file stored by AiEmployee', async () => {
    const result = await manager.read({
      aiEmployeeId: '655392ae1d53c10df51872b1',
      filename: '0_8mgB0OT85vOFh66l.jpeg',
    });

    expect(result).toHaveProperty('id');
  });
});
