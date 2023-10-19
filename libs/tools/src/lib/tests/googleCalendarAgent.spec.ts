import {
    initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { OpenAI } from 'langchain/llms/openai';
import { GoogleCalendarAgent } from '../googleCalendarAgent.tool';

  const googleCalendarParams = {
    credentials: {
      clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
      calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
    },
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  }
  
  
  describe('Calculator tool test', () => {
      const model = new OpenAI({ temperature: 0, verbose: true });
      const tools = [
          new GoogleCalendarAgent({
            mode: 'full',
            calendarOptions: googleCalendarParams,
            openApiOptions: { temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY }
          }),
        ];
  
  
    it('should send email successfull', async () => {
    
      const executor = await initializeAgentExecutorWithOptions(
          tools,
          model,
          {
            agentType: 'zero-shot-react-description',
            verbose: true,
          }
        );
        const result = await executor.call({ input: 'What meetings do I have tomorrow' });
        expect(result.output).toEqual('you have a meeting with the core team at 9:00 am');
      })
  });