import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { DynamicTool } from "langchain/tools";
import { GoogleCalendarViewTool } from "langchain/tools/google_calendar";


export class GoogleCalendarView extends DynamicTool {
    constructor() {
        super({
        name: 'Google Calendar',
        description:
            'Use to access Google Calendar. Input should be a task instruction to executor.',
        func: async (input) => {
            const model = new OpenAI({
                temperature: 0,
                openAIApiKey: process.env.OPENAI_API_KEY,
              });
            
              const googleCalendarParams = {
                credentials: {
                  clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
                  privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
                  calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
                },
                scopes: [
                  "https://www.googleapis.com/auth/calendar",
                  "https://www.googleapis.com/auth/calendar.events",
                ],
                model,
              };
            
              const tools = [
                new GoogleCalendarViewTool(googleCalendarParams),
              ];

            const calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
                agentType: "zero-shot-react-description",
                verbose: true,
              });

              const viewResult = await calendarAgent.call({input});
              
              console.log("view Result", viewResult);
              return viewResult.output;
        }

    })
    }
}    