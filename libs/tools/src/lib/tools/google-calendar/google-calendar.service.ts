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
        console.log(res.data)
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
        return json;
    }

    async createEvent(event: calendar_v3.Schema$Event) {
        const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
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
        return res.statusText;
    }


};
const token = "ya29.a0AfB_byBdUway3wd36iWiCVp2Uv_zytzALBXyWQmSBEtCmanWz4WI8_zC3AtzvWYQ7fVw5pSfquhC083IrW3x12pOnydxQ48roAOv06mehdvXVG83p02KldMBBufbj30Hxb9YFkER-hjW-baFf-puxQtE8fgVX_jOBvQaCgYKAZwSARMSFQHGX2MiQWuRC1LtT3zwvzj_qCbQ3g0170"

const googleService = new GoogleCalendarService(token)
const options = {
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
}
googleService.listEvents(options)