import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { GoogleCalendarToolkitSettings } from './google-calendar.interfaces';
import { GoogleCalendarService } from './google-calendar.service';

export class GoogleCalendarDeleteEventTool extends DynamicStructuredTool {
  constructor(settings: GoogleCalendarToolkitSettings) {
    super({
      name: 'Google Calendar Delete Events',
      metadata: { id: "google-calendar", tool: 'delete' },
      description: 'Use to delete events from Google Calendar.',
      schema: z.object({
        eventId: z.string().describe('ID of event to delete')
      }),
      func: async ({ eventId }) => {
        try {
          const googleCalendarService = new GoogleCalendarService(settings.token);
          const deleteEvent = await googleCalendarService.deleteEvent(eventId);
          return deleteEvent;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
