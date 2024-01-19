import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

  const skills: Skill[] = [
    {
      name: 'Log in with email and password to HubSpot',
      description: 'Use this to login on HubSpot with email and password.',
      inputs: {
        email: {
          type: 'string',
          description: 'Email on HubSpot account.',
        },
        password: {
          type: 'string',
          description: 'Password on HubSpot account.',
        },
      },
      steps: [
        { method: 'loadUrl', params: { url: 'https://app.hubspot.com/login' } },
        {
          method: 'if',
          params: {
            condition: "browserMemory.currentUrl.includes('/beta')",
            steps: [
              {
                method: 'click',
                params: {
                  selector:
                    'body > div > div:nth-child(1) > div:nth-child(2) > div > div > div.UIFlex__StyledFlex-sc-1q5m0km-0.gZqqHI.private-flex > div > div > div > div > span > a',
                  sleep: 3000,
                },
              },
            ],
          },
        },
        {
          method: 'inputText',
          params: { selector: '#username', content: '{email}' },
        },
        {
          method: 'inputText',
          params: { selector: '#password', content: '{password}' },
        },
        { method: 'click', params: { selector: '#loginBtn', sleep: 3000 } },
      ],
    },

    {
      name: 'Log in with Google Account to HubSpot',
      description: 'Use this to login on HubSpot with your Google Account.',
      inputs: {
        email: {
          type: 'string',
          description: 'Email on Google account.',
        },
        password: {
          type: 'string',
          description: 'Password on Google account.',
        },
      },
      steps: [
        { method: 'loadUrl', params: { url: 'https://app.hubspot.com/login' } },
        {
          method: 'if',
          params: {
            condition: "browserMemory.currentUrl.includes('/beta')",
            steps: [
              {
                method: 'click',
                params: {
                  selector:
                    'body > div > div:nth-child(1) > div:nth-child(2) > div > div > div.UIFlex__StyledFlex-sc-1q5m0km-0.gZqqHI.private-flex > div > div > div > div > span > a',
                  sleep: 3000,
                },
              },
            ],
          },
        },
        {
          method: 'click',
          params: {
            selector:
              '#hs-login > div.ThirdPartyLoginElementsstyles__ThirdPartyLoginWrapper-sc-1dbc14d-0.ZVxQp > button:nth-child(1)',
          },
        },
        // Logged user - With Google Accounts
        {
          method: 'if',
          params: {
            condition:
              "browserMemory.currentUrl.includes('/oauthchooseaccount')",
            steps: [
              {
                method: 'click',
                params: {
                  selector:
                    '#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li.JDAKTe.eARute.W7Aapd.zpCp3.SmR8 > div',
                  sleep: 3000,
                },
              },
            ],
          },
        },
        {
          method: 'if',
          params: {
            condition:
              "browserMemory.currentUrl.includes('/signin/identifier') || browserMemory.currentUrl.includes('/auth/identifier')",
            steps: [
              {
                method: 'inputText',
                params: { selector: '#identifierId', content: '{email}' },
              },
              {
                method: 'click',
                params: { selector: '#identifierNext', sleep: 3000 },
              },
              {
                method: 'inputText',
                params: {
                  selector:
                    '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input',
                  content: '{password}',
                  sleep: 3000,
                },
              },
              {
                method: 'click',
                params: { selector: '#passwordNext', sleep: 3000 },
              },
            ],
          },
        },
      ],
    },
  ];

  const email = process.env.GOOGLE_EMAIL;
  const password = process.env.GOOGLE_PASSWORD;

  // TODO: switch to personal email for testing
  const memory = `
    HubSpot:
    - Email: ${email}
    - Password: ${password}

    HubSpot Login status: true
    `;

  const browserAgent = new BrowserAgent(skills, memory, {
    _id: 'testaiemployee',
  } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Login with email', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in with email and password to HubSpot',
    });
    console.log(resultLogin);
  });

  test('Login with google', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in with Google Account to HubSpot',
    });
    console.log(resultLogin);
  });
});
