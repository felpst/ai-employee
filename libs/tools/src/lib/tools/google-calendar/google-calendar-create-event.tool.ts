import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { GoogleCalendarToolkitSettings } from './google-calendar.interfaces';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarCreateEventTool extends DynamicStructuredTool {
  constructor(settings: GoogleCalendarToolkitSettings) {
    super({
      name: 'Google Calendar Create Events',
      metadata: { id: "google-calendar", tool: 'create' },
      description:
        'Use this tool to create events from Google Calendar.',
      schema: z.object({
        startTime: z.string().describe("start time of event, the format is 'YYYY-MM-DDTHH:MM:SS'"),
        endTime: z.string().describe("end time of event, the format is 'YYYY-MM-DDTHH:MM:SS'"),
        summary: z.string().optional().describe('summary of event'),
        location: z.string().optional().describe('location of event'),
        description: z.string().optional().describe('description of event'),
        attendees: z.array(z.object({ email: z.string() })).optional().describe('Event participants must be represented by an array of objects, where each object contains an unquoted email key associated with a value that represents an email address"'),
      }),
      func: async ({
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
              timeZone: settings.user.timezone,
            },
            end: {
              dateTime: endTime,
              timeZone: settings.user.timezone,
            },
            attendees,
          };
          const createEvent = await googleCalendarService.createEvent(options);
          return createEvent;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
