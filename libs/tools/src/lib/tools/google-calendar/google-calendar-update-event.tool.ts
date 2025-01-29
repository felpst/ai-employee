import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { GoogleCalendarToolkitSettings } from './google-calendar.interfaces';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarUpdateEventTool extends DynamicStructuredTool {
  constructor(settings: GoogleCalendarToolkitSettings) {
    super({
      name: 'Google Calendar Update Events',
      metadata: { id: "google-calendar", tool: 'update' },
      description:
        'Use this tool to update events from Google Calendar, you can use the google calendar list tool to get the event id.',
      schema: z.object({
        eventId: z.string().optional().describe('ID of event to update'),
        startTime: z.string().optional().describe("Start time of event, format: 'YYYY-MM-DDTHH:MM:SS'"),
        endTime: z.string().optional().describe("End time of event, format: 'YYYY-MM-DDTHH:MM:SS'"),
        summary: z.string().optional().describe('Summary of event'),
        location: z.string().optional().describe('Location of event'),
        description: z.string().optional().describe('Description of event'),
        attendees: z.array(z.object({ email: z.string() })).optional().describe('Event participants represented by an array of objects, where each object contains an email key associated with an email address'),
      }),
      func: async ({
        eventId,
        startTime,
        endTime,
        summary,
        location,
        description,
        attendees,
      }) => {
        try {
          const googleCalendarService = new GoogleCalendarService(settings.token);
          const options: calendar_v3.Schema$Event = {
            summary,
            location,
            description,
            start: {
              dateTime: startTime,
              timeZone: settings.user.timezone
            },
            end: {
              dateTime: endTime,
              timeZone: settings.user.timezone
            },
            attendees,
          };
          const updateEvent = await googleCalendarService.updateEvent(eventId, options);
          return updateEvent;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
