import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarListEventsTool extends DynamicStructuredTool {
  constructor(token: string) {
    super({
      name: 'Google Calendar List Events',
      metadata: { id: "google-calendar", tool: 'list' },
      description:
        'Use this tool to list events from Google Calendar.',
      schema: z.object({
        maxResults: z.number().describe('quantity of events to list'),
        orderBy: z.string().describe('order of events just startTime or updated are allowed'),
      }),
      func: async ({ maxResults, orderBy }) => {
        try {
          const googleCalendarService = new GoogleCalendarService(token);
          const options: calendar_v3.Params$Resource$Events$List = {
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            maxResults,
            orderBy,
          }
          const eventList = await googleCalendarService.listEvents(options);
          return "Events list: \n```json\n" + eventList + "\n```";
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
