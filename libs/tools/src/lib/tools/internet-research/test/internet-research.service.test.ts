import 'dotenv/config';
import { SearchApiResult, SearchApiToolSettings } from '../internet-research.interface';
import { InternetResearchService } from '../internet-research.service';
import { SummarizationService } from '../summarization.service';

describe('Internet Research service test', () => {
  jest.setTimeout(3000000);
  let settings: SearchApiToolSettings
  let entity: SearchApiResult[]
  const input = 'what are the latest football news in Brazil ?'

  beforeAll(async () => {
    settings = {
      API_KEY: process.env.SERPAPI_API_KEY
    }
  });

  it('search', async () => {
    const researchService = new InternetResearchService(settings);

    const result = await researchService.search(input);
    console.log(result)

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].position).toBeDefined()
    expect(result[0].title).toBeDefined();
    expect(result[0].url).toBeDefined();

    entity = result
  });

  it('summarize', async () => {
    const summarizationService = new SummarizationService();
    await summarizationService.start()

    const result = await summarizationService.summarize(entity, input);

    console.log(result)

    expect(result).toBeDefined();
  })
});