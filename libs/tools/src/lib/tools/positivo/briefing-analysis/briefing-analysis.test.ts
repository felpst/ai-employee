import { BriefingAnalysisService } from './briefing-analysis.service';
import 'dotenv/config';

describe('Briefing analysis test', () => {
  jest.setTimeout(30000000)

  it('should analyze audiences and return 50 most relevant according to the briefing', async () => {
    const aiEmployeeId = '655392ae1d53c10df51872b1'
    const briefingName = '72ba66aaaf90abe039af67a5e267690e4159860a967abae696e93d5545996a3a_testBriefing.txt'
    const audienceName = '7aa3911d532ab625f8053cf7fcb3cd36513b46905dde44e98836e48fff58c028_testAudience.txt'


    const service = new BriefingAnalysisService();
    const result = await service.analyze(briefingName, audienceName, aiEmployeeId, 50);
    console.log(result)

    expect(result).toBeDefined();
  })
})