import { calendar_v3 } from 'googleapis';
import { DynamicStructuredTool } from 'langchain/tools';
import { z } from 'zod';
import { GoogleCalendarService } from './google-calendar.service';


export class GoogleCalendarUpdateEventTool extends DynamicStructuredTool {
    constructor(token: string) {
        super({
            name: 'Google Calendar Update Events',
            description:
                'Use this tool to update events from Google Calendar.',
            schema: z.object({
                eventId: z.string().describe('id of event to update'),
                startTime: z.string().describe("start time of event, the format is 'YYYY-MM-DDTHH:MM:SS'"),
                endTime: z.string().describe("end time of event, the format is 'YYYY-MM-DDTHH:MM:SS'"),
                summary: z.string().describe('summary of event'),
                location: z.string().describe('location of event'),
                description: z.string().describe('description of event'),
                timeZone: z.string().describe('time zone of event, the format is "America/Los_Angeles"'),
                attendees: z.array(z.string()).describe('attendees of event, the format is {email: example@example.com}"'),

            }),
            func: async ({
                eventId,
                startTime,
                endTime,
                summary,
                location,
                description,
                timeZone,
                attendees,
            }) => {
                try {
                    const googleCalendarService = new GoogleCalendarService(token);
                    const options: calendar_v3.Schema$Event = {
                        summary,
                        location,
                        description,
                        start: {
                            dateTime: startTime,
                            timeZone,
                        },
                        end: {
                            dateTime: endTime,
                            timeZone,
                        },
                        attendees,
                    }
                    const updateEvent = await googleCalendarService.updateEvent(eventId, options);
                    return updateEvent;
                } catch (error) {
                    return error.message;
                }
            },
        });
    }
}
