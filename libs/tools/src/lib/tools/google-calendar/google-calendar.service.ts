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
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
            ...options,
        });
        const events = res.data.items;
        if (!events || events.length === 0) {
            return 'No upcoming events found.';
        }
        events.map((event) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary} - ${event.id}`);
            return `${start} - ${event.summary} - ${event.id}`;
        });
    }

    async createEvent(event: calendar_v3.Schema$Event) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        console.log(res.statusText);

        return res.statusText;
    }

    async updateEvent(eventId: string, event: calendar_v3.Schema$Event) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event,
        });
        return res.statusText;

    }

    async deleteEvent(eventId: string) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });
        console.log(res.statusText);

        return res.statusText;
    }


};

const accessToken = 'ya29.a0AfB_byDGtp8NLvS9w_bcf5oGMl4lfyTPHfX5nnnQAAQCYS7vWQn_INkXwQx1asx5s-Ra7Ci8dkfAwPq2gOhBVcnvvO-_-3H_Rw6b7i9159WQ-OvIECklRqM7mcLhjpniMzTGp_oj38EZ1MGSNjza5Lp7sXmeEWW4OpAaCgYKAZYSARMSFQHGX2MimI7rcAco7dl7HjqVsSuBXw0170';
const googleCalendarService = new GoogleCalendarService(accessToken);
// googleCalendarService.listEvents()
// const eventObj = {
//     summary: 'Google I/O 2021',
//     location: '800 Howard St., San Francisco, CA 94103',
//     description: 'A chance to hear more about Google\'s developer products.',
//     start: {
//         dateTime: '2021-05-18T09:00:00-07:00',
//         timeZone: 'America/Los_Angeles',
//     },
//     end: {
//         dateTime: '2021-05-18T17:00:00-07:00',
//         timeZone: 'America/Los_Angeles',
//     },
//     recurrence: [
//         'RRULE:FREQ=DAILY;COUNT=2'
//     ],
//     attendees: [
//         { email: 'devrenatorodrigues@gmail.com' }
//     ],
// }
// googleCalendarService.createEvent(eventObj);
// const eventUpdateObj = {
//     summary: 'Minha Casa',
//     location: 'Estrada Capim Branco',
//     description: 'A chance to live in nature.',
//     start: {
//         dateTime: '2021-12-06T09:00:00-04:00',
//         timeZone: 'America/Los_Angeles',
//     },
//     end: {
//         dateTime: '2023-12-06T17:00:00-08:00',
//         timeZone: 'America/Los_Angeles',
//     },
// }
// googleCalendarService.updateEvent('3tjn0u7n389go90nes83glrcqf', eventUpdateObj);
googleCalendarService.deleteEvent('3tjn0u7n389go90nes83glrcqf');