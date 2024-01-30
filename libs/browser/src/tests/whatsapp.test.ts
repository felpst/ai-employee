import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

  const skills: Skill[] = [
    {
      name: 'Log in to WhatsApp Web',
      description: 'Use this to login on WhatsApp Web.',
      inputs: {},
      steps: [
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
        // TODO: IMPLEMENTS LOGIN WITH AIEMPLOYEE
      ],
    },

    {
      name: 'List all conversations on WhatsApp',
      description: 'Use it to list all conversations on WhatsApp.',
      inputs: {},
      steps: [
        {
          method: 'loop',
          params: {
            times: 3,
            steps: [
              {
                method: 'dataExtraction',
                params: {
                  container: '[role="listitem"]',
                  saveOn: 'chats',
                  properties: [
                    {
                      name: 'name',
                      selector:
                        'div > div > div > div._8nE1Y > div.y_sn4 > div._21S-L > div > span',

                      required: true,
                    },
                  ],
                },
              },
              {
                method: 'elementScroll',
                params: {
                  pixels: 1000,
                  selector: '#pane-side',
                  direction: 'vertical',
                  useCurrentScroll: true,
                },
              },
            ],
          },
        },
        {
          method: 'saveOnFile',
          params: { fileName: 'whatsApp-chats', memoryKey: 'chats' },
        },
      ],
      successMessage: 'WhatsApp conversations listed successfully!',
    },
  ];

  const memory = `
    WhatsApp Web:

    WhatsApp Web Login status: true
    `;

  const browserAgent = new BrowserAgent(skills, memory, {
    _id: 'testaiemployee',
  } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Login on WhatsApp', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web',
    });
    console.log(resultLogin);
  });

  test('List all conversations on WhatsApp', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web and list all conversations',
    });
    console.log(resultLogin);
  });
});
