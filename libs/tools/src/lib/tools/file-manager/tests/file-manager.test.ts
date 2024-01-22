import 'dotenv/config';
import { FileManager } from '../file-manager';

describe('File manager test', () => {
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

  it('Create a new file for AIEmployee', async () => {
    const filename = 'teste.txt';
    const blobs = [Buffer.from('Olá, '), Buffer.from('Mundo!')];
    const result = await manager.create({
      aiEmployeeId: '655392ae1d53c10df51872b1',
      file: new File(blobs, filename),
    });

    expect(result).toContain(filename);
  });

  it('Update AIEmployee file', async () => {
    const filename =
      '4a9564735072c8743f9a38bd1cac47f104c6ac662ea20a8a0e852c5677e83f90_teste.txt';
    const blobs = [
      Buffer.from('Teste '),
      Buffer.from('de '),
      Buffer.from('atualização.'),
    ];
    const result = await manager.update({
      aiEmployeeId: '655392ae1d53c10df51872b1',
      file: new File(blobs, filename),
      filename,
    });

    expect(result).toContain(filename);
  });

  it('Delete a file stored by AiEmployee', async () => {
    const result = await manager.delete({
      aiEmployeeId: '655392ae1d53c10df51872b1',
      filename:
        '4a9564735072c8743f9a38bd1cac47f104c6ac662ea20a8a0e852c5677e83f90_teste.txt',
    });

    expect(result).toBeTruthy();
  });
});
