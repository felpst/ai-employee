import { getJson } from 'serpapi';
import { SearchApiToolSettings } from "./internet-research.interface";

export class InternetResearchService {
  constructor(
    private settings: SearchApiToolSettings
  ) { }

  async search(query: string, qt: number = 5): Promise<any> {
    const search = await getJson({
      engine: 'google',
      q: query,
      api_key: this.settings.API_KEY,
      num: qt
    }, (json) => {
      return json.organic_results
    })

    if (!search) return 'No results found'

    const searchResult = []

    for (const result of search.organic_results) {
      const parsedResult = {
        position: result.position,
        title: result.title,
        url: result.link,
        date: result.date
      }

      searchResult.push(parsedResult)
    }

    return searchResult
  }
}