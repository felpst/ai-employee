import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

type dbInfo = {
  user: string;
  password: string;
}

export class ChatHistoryTool extends DynamicTool {
  constructor(dbPrimario: dbInfo, dbSecundario?: dbInfo) {
    super({
      name: 'Chat History',
      description:
        'Use this when you need search informations you dont know and possible to find in chat history. Input should be a question.',
      func: async (input: string) => {
        const response = await axios.post(process.env.SQL_TOOL_URL, { input });
        if (dbSecundario && response.data === 'Not enough data to search') {
          const second_response = await axios.post(process.env.SQL_TOOL_URL, {
            input
          })
          return second_response.data;
        }
        return response.data;
      },
    });
  }
}
