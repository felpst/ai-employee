import { OAuth2Client } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';

export class GoogleCalendarService {
    private oAuth2Client: OAuth2Client;

    constructor(token: string) {
        this.oAuth2Client = new OAuth2Client();
        this.oAuth2Client.setCredentials({ access_token: token });
    }

    async listEvents(options: calendar_v3.Params$Resource$Events$List = {}) {

        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.list(options);
        const events = res.data.items;
        if (!events || events.length === 0) {
            return 'No upcoming events found.';
        }
        const results = events.map((event) => {
            const start = event.start?.dateTime || event.start?.date;
            const { id, summary } = event
            return { id, summary, start };
        });
        const json = JSON.stringify(results);
        console.log(json);

        return json;
    }

    async createEvent(event: calendar_v3.Schema$Event) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        if (res.status === 200) {
            return 'Event created Successfully';
        }
    }

    async updateEvent(eventId: string, event: calendar_v3.Schema$Event) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event,
        });
        console.log(res)
        if (res.status === 200) {
            return 'Event updated Successfully';
        }

    }

    async deleteEvent(eventId: string) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });
        if (res.status === 204) {
            return 'Event deleted Successfully';
        }
    }


};
// const token = "ya29.a0AfB_byBM8nXThCVR1yAisO6ql1Oe5j2EVjMIbFQQm9BiuX8NVbRT2_a8hCaFtAR2hvEc7x2ys191YNZyJy04Q1jOStoMuRLd0LVD0sza45Xit5-bAhHi1ynRpQz0O1iwqioQMcxmTMzydYBIgclcgISIjSd0JWUq0YIaCgYKAQkSARMSFQHGX2MiYgwECN9xLp7pXmMOCIYr1w0170"

// const googleService = new GoogleCalendarService(token)
// const options = {
//     calendarId: 'primary',
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
// }
// googleService.listEvents(options)

// const options = {
//     summary: 'Google I/O 2015',
//     location: '800 Howard St., San Francisco, CA 94103',
//     description: 'A chance to hear more about Google\'s developer products.',
//     start: {
//         dateTime: '2023-12-08T09:00:00-07:00',
//         timeZone: 'America/Los_Angeles'
//     },
//     end: {
//         dateTime: '2023-12-08T17:00:00-07:00',
//         timeZone: 'America/Los_Angeles'
//     },
//     attendees: [
//         { email: 'devrenatorodrigues@gmail.com' },
//     ],
// }
//  googleService.cEvent(eventId, options)

// const eventId = "3rsq8694pesbav04s3vh5l2is0"
// googleService.updateEvent(eventId, options)
// googleService.deleteEvent(eventId)