import { DynamicTool } from 'langchain/tools';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarDeleteEventTool extends DynamicTool {
  constructor(token: string) {
    super({
      name: 'Google Calendar Delete Events',
      metadata: { id: "google-calendar", tool: 'delete' },
      description:
        'Use to delete events from Google Calendar. Input should be the event id, you can use the google calendar list tool to get the event id.',
      func: async (input: string) => {
        try {
          const googleCalendarService = new GoogleCalendarService(token);
          const deleteEvent = await googleCalendarService.deleteEvent(input);
          return deleteEvent;
        } catch (error) {
          return error.message;
        }
      },
    });
  }
}
