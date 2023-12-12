import { google } from 'googleapis';

class OAuth2Service {
  private credentials = {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    callbackURL: `${process.env.APP_URL}/oAuth2/google/callback`,
  }

  googleAuthUrl(scope: string) {
    const oAuth2Client = new google.auth.OAuth2(
      this.credentials.client.id,
      this.credentials.client.secret,
      this.credentials.callbackURL
    )
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope
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
