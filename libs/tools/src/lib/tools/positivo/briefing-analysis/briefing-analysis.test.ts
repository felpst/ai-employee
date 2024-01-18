import { BriefingAnalysisService } from './briefing-analysis.service';
import { xandr } from './example-files/xandr'
import 'dotenv/config';
import { FileManagerService } from '../../file-manager';
import fs from 'fs';
import path from "path"

describe('Briefing analysis test', () => {
  jest.setTimeout(3000000)
  const manager = new FileManagerService();
  const audiencesPath = path.join(__dirname, `./example-files/xandr.json`);
  const briefingPath = path.join(__dirname, `./example-files/briefing-example1.txt`);
  const briefingPath2 = path.join(__dirname, `./example-files/briefing-example5.txt`);

  beforeAll(async () => {
    await fs.readFile(briefingPath, async (err, data) => {
      if (err) throw err;
      await manager.create({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        file: new File([data.toString()], 'testBriefing.txt'),
     })
    })

    await fs.readFile(briefingPath2, async (err, data) => {
      if (err) throw err;
      await manager.create({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        file: new File([data.toString()], 'testBriefing2.txt'),
     })
    })

    await fs.readFile(audiencesPath, async (err, data) => {
      if (err) throw err;
      await manager.create({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        file: new File([data.toString()], 'testAudience.txt'),
      })
    });

    afterAll(async () => {
      await manager.delete({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        filename: 'testBriefing.txt',
      })
      await manager.delete({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        filename: 'testBriefing2.txt',
      })
      await manager.delete({
        aiEmployeeId: '655392ae1d53c10df51872b1',
        filename: 'testAudience.txt',
      })
    })

  })

  it('should analyze audiences and return 50 most relevant according to the briefing', async () => {
    const audiences = []
    for(let i=0; i<70; i++) {
      audiences.push(xandr[i])
    }

    const aiEmployeeId = '655392ae1d53c10df51872b1'
    const briefing = 'Nome da ação: Casa de Investimento \n Objetivo: Captar mais usuários para investirem com o Sicredi.\n Segmentação: MT, PA, AC, RO,AM e AP\n Público: Alta renda a partir 300k com o foco da segmentação para investimentos'

    const service = new BriefingAnalysisService();
    const result = await service.analyze(briefing, audiences, aiEmployeeId, 50, 'testBriefing.txt', 'testAudience.txt');
    console.log(result)

    expect(result).toBeDefined();
  })

  it.skip('should analyze audiences and return 50 most relevant according to the briefing', async () => {
    const audiences = []
    for(let i=0; i<70; i++) {
      audiences.push(xandr[i])
    }

    const aiEmployeeId = '655392ae1d53c10df51872b1'
    const briefing = 'Campanha: Revendedores\nPeríodo: 01/03 até novembro\nObjetivo: Tráfego para URL, compra por CPC\nTarget: AS 18+ que são Autônomos + Recebem e-mails de Empregos/Busca emprego, entre outras características relacionadas.\nPraça: Nacional.\n'

    const service = new BriefingAnalysisService();
    const result = await service.analyze(briefing, xandr, aiEmployeeId, 50, 'testBriefing2.txt', 'testAudience.txt');

    console.log(result)

    expect(result).toBeDefined();
  })
})