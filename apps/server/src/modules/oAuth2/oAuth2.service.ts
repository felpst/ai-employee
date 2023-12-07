import { google } from 'googleapis';

class OAuth2Service {
    private credentials = {
        client: {
            id: "406835646817-0s22gb6hb6pg1uac6cgp1drvopusihqa.apps.googleusercontent.com",
            secret: "***REMOVED***",
        },
        callbackURL: 'http://localhost:3001/tools-settings/auth2/google/callback',
    }

    private SCOPES = ['https://www.googleapis.com/auth/calendar']

    getAuthUrl() {
        const oAuth2Client = new google.auth.OAuth2(
            this.credentials.client.id,
            this.credentials.client.secret,
            this.credentials.callbackURL
        )
        return oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
    }

    async getToken(code: string) {
        const oAuth2Client = new google.auth.OAuth2(
            this.credentials.client.id,
            this.credentials.client.secret,
            this.credentials.callbackURL
        );
        return await oAuth2Client.getToken(code);
    }
};


export default new OAuth2Service();