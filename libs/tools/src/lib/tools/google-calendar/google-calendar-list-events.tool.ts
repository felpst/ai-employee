import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { GoogleCalendarToolkitSettings } from './google-calendar.interfaces';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarListEventsTool extends DynamicStructuredTool {
  constructor(settings: GoogleCalendarToolkitSettings) {
    super({
      name: 'Google Calendar List Events',
      metadata: { id: "google-calendar", tool: 'list' },
      description: 'Use this tool to search the calendar for upcoming meetings or events.',
      schema: z.object({
        maxResults: z.number().describe('quantity of events to list').optional().default(100),
        orderBy: z.enum(['startTime', 'updated']).describe('order of events just startTime or updated are allowed').optional().default('startTime'),
      }),
      func: async ({ maxResults, orderBy }) => {
        try {
          const googleCalendarService = new GoogleCalendarService(settings.token);
          const options: calendar_v3.Params$Resource$Events$List = {
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            maxResults,
            orderBy,
            timeZone: settings.user.timezone
          };
          const eventList = await googleCalendarService.listEvents(options);
          return "Events list: \n```json\n" + eventList + "\n```";
        } catch (error) {
          console.error(error);
          return error.message;
        }
      },
    });
  }
}
