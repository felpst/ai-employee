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
        { method: 'click', params: { selector: '#loginBtn', sleep: 2000 } },
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
                  sleep: 2000,
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
                params: { selector: '#identifierNext', sleep: 2000 },
              },
              {
                method: 'inputText',
                params: {
                  selector:
                    '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input',
                  content: '{password}',
                  sleep: 2000,
                },
              },
              {
                method: 'click',
                params: { selector: '#passwordNext', sleep: 2000 },
              },
            ],
          },
        },
      ],
    },
    {
      name: 'New Customer Registration in HubSpot',
      description: 'Use it to create a new customer in HubSpot.',
      inputs: {
        name: {
          type: 'string',
          description: 'Customer name.',
        },
        lastname: {
          type: 'string',
          description: 'Customer last name.',
        },
        email: {
          type: 'string',
          description: 'Email associated with the seller.',
        },
        phone: {
          type: 'string',
          description: 'Telephone number associated with the seller.',
        },
      },
      steps: [
        {
          method: 'click',
          params: { selector: '#crm-toggle' },
        },
        {
          method: 'click',
          params: { selector: '#contacts', sleep: 2500 },
        },
        {
          method: 'click',
          params: {
            selector: '[data-test-id="new-object-button"]',
            sleep: 2000,
          },
        },
        {
          method: 'switchToFrame',
          params: { selector: 'iframe#object-builder-ui', sleep: 1000 },
        },
        {
          method: 'inputText',
          params: {
            selector: '#UIFormControl-1',
            content: '{email}',
            sleep: 2000,
          },
        },
        {
          method: 'inputText',
          params: { selector: '#UIFormControl-3', content: '{name}' },
        },
        {
          method: 'inputText',
          params: { selector: '#UIFormControl-5', content: '{lastname}' },
        },
        {
          method: 'click',
          params: { selector: '#UIFormControl-13', sleep: 1000 },
        },
        {
          method: 'clickByText',
          params: {
            text: 'Remove number formatting',
            tagName: 'i18n-string',
            sleep: 1500,
            ignoreNotExists: true,
          },
        },
        {
          method: 'inputText',
          params: {
            selector:
              '#uiopenpopup-12 > div > div > div.private-popover__inner > div > div.uiEditableControls.private-editable-control.PropertyInputPhoneWrapper__StyledUIEditableControls-wstpno-0.dRfCJR.m-bottom-1.p-x-4.p-bottom-4.private-editable-control--flush > div.PropertyInputPhone__Wrapper-sc-1ylillo-0.ggbLXq > input',
            content: '{phone}',
            sleep: 2000,
          },
        },
        {
          method: 'click',
          params: {
            selector: '[data-button-use="tertiary"]',
            sleep: 2000,
          },
        },
        {
          method: 'click',
          params: {
            selector:
              'body > div.page > div:nth-child(1) > div > form > footer > div > div > div > div > button.uiButton.private-button.private-button--primary.private-button--default.private-loading-button.private-button--primary.private-button--non-link',
            sleep: 2000,
          },
        },
      ],
      successMessage: 'Customer added successfully!',
    },
    {
      name: 'List reports in HubSpot',
      description: 'Use it to list all reports in HubSpot.',
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
                  sleep: 2000,
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
                params: { selector: '#identifierNext', sleep: 2000 },
              },
              {
                method: 'inputText',
                params: {
                  selector:
                    '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input',
                  content: '{password}',
                  sleep: 2000,
                },
              },
              {
                method: 'click',
                params: { selector: '#passwordNext', sleep: 2000 },
              },
            ],
          },
        },
        {
          method: 'click',
          params: { selector: '#reports-and-data-toggle' },
        },
        { method: 'sleep', params: { time: 1000 } },
        {
          method: 'click',
          params: { selector: '#reports-list-v5-ia' },
        },
      ],
      successMessage: 'Reports listed successfully!',
    },
    {
      name: 'Search a report in HubSpot',
      description: 'Use it to search a report in HubSpot.',
      inputs: {
        email: {
          type: 'string',
          description: 'Email on Google account.',
        },
        password: {
          type: 'string',
          description: 'Password on Google account.',
        },
        title: {
          type: 'string',
          description: 'Report title on HubSpot.',
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
                  sleep: 2000,
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
                params: { selector: '#identifierNext', sleep: 2000 },
              },
              {
                method: 'inputText',
                params: {
                  selector:
                    '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input',
                  content: '{password}',
                  sleep: 2000,
                },
              },
              {
                method: 'click',
                params: { selector: '#passwordNext', sleep: 2000 },
              },
            ],
          },
        },
        {
          method: 'click',
          params: { selector: '#reports-and-data-toggle' },
        },
        { method: 'sleep', params: { time: 1000 } },
        {
          method: 'click',
          params: { selector: '#reports-list-v5-ia' },
        },
        { method: 'sleep', params: { time: 1000 } },
        {
          method: 'inputText',
          params: {
            selector: "input[placeholder='Search reports']",
            content: '{title}',
          },
        },
        { method: 'sleep', params: { time: 1000 } },
        {
          method: 'click',
          params: {
            selector:
              'div > div > div.UIBox__Box-sc-1n1pynx-0.jsXblh.private-flex__child.CustomListingPage__StyledMainContentBox-sc-12gsl9f-2.kRdwWy.overflow-y-auto > div > div.p-top-4 > div > div > div.UIScrollContainer__DefaultScrollContainer-sc-7h3rlw-0.llsHjB > table > tbody > tr > td:nth-child(3) > div > div.media-body.private-media__body',
          },
        },
      ],
      successMessage: 'Search a report successfully!',
    },
  ];

  const email = process.env.GOOGLE_EMAIL;
  const password = process.env.GOOGLE_PASSWORD;

  const customerName = 'Customer';
  const customerLastname = 'Test';
  const customerEmail = 'customer-test@gmail.com';
  const customerPhone = '+55-86-99999-9999';
  const reportTitle = 'Activity of recently';

  // TODO: switch to personal email for testing
  const memory = `
    HubSpot:
    - Email: ${email}
    - Password: ${password}
    - CustomerName: ${customerName}
    - CustomerLastname: ${customerLastname}
    - CustomerEmail: ${customerEmail}
    - CustomerPhone: ${customerPhone}
    - ReportTitle: ${reportTitle}

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

  test('Create a new Customer', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Login to Hubspot using Google account and create a new Customer',
    });
    console.log(resultLogin);
  });

  test('List all reports', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'List all reports on HubSpot',
    });
    console.log(resultLogin);
  });

  test('Search a report', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Search a report on HubSpot',
    });
    console.log(resultLogin);
  });
});
