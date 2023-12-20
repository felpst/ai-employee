import 'dotenv/config';
import { SearchApiResult, SearchApiToolSettings } from './internet-research.interface';
import { InternetResearchService } from './internet-research.service';
import { SummarizationService } from './summarization.service';

describe('Internet Research service test', () => {
  let settings: SearchApiToolSettings
  let entity: SearchApiResult

  beforeAll(async () => {
    settings = {
      API_KEY: process.env.SERPAPI_API_KEY
    }
  });

  it('search', async () => {
    const researchService = new InternetResearchService(settings);

    const result = await researchService.search('Emerging technologies in 2023');

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].position).toBeDefined()
    expect(result[0].title).toBeDefined();
    expect(result[0].url).toBeDefined();
    expect(result[0].date).toBeDefined();

    entity = result[0]
  });

  it('summarize', async () => {
    console.log(settings)
    const summarizationService = new SummarizationService();
    await summarizationService.start()

    const result = await summarizationService.summarize(entity);

    expect(result).toBeDefined();
  })
});