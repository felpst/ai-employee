import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { GoogleCalendarToolkitSettings } from './google-calendar.interfaces';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarSeachEventsTool extends DynamicStructuredTool {
  constructor(settings: GoogleCalendarToolkitSettings) {
    super({
      name: 'Google Calendar Search',
      metadata: { id: "google-calendar", tool: 'search' },
      description: 'Use this tool to search for upcoming meetings or events.',
      schema: z.object({
        q: z.string().describe('text to search').optional().default(''),
        maxResults: z.number().describe('quantity of events to list').optional().default(100),
      }),
      func: async ({ q, maxResults }) => {
        try {
          console.log({ q, maxResults });
          console.log({ settings });

          const googleCalendarService = new GoogleCalendarService(settings.token);
          const options: calendar_v3.Params$Resource$Events$List = {
            q,
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            maxResults,
            orderBy: 'startTime',
            timeZone: settings.user.timezone
          }
          const eventList = await googleCalendarService.listEvents(options);
          return "Events list: \n```json\n" + eventList + "\n```";
        } catch (error) {
          console.error(error)
          return error.message;
        }
      },
    });
  }
}
