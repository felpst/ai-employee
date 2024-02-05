import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);
  // Empirical: From here on it does not repeat values in extraction
  const DEFAULT_PIXELS_TO_SCROLL = 1450;

  const skills: Skill[] = [
    {
      name: 'Log in on WhatsApp Web',
      description: 'Use this to login on WhatsApp Web.',
      inputs: {},
      steps: [
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
        // TODO: IMPLEMENTS LOGIN WITH AIEMPLOYEE
      ],
      successMessage: 'WhatsApp log in completed successfully!',
    },
    {
      name: 'List all conversations on WhatsApp Web',
      description: 'Use it to list all conversations on WhatsApp Web.',
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
                  container:
                    'div[role="listitem"] > div.g0rxnol2 > div[role="row"]',
                  saveOn: 'chats',
                  properties: [
                    {
                      name: 'name',
                      selector:
                        'div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > span',
                      type: 'string',
                      required: true,
                    },
                  ],
                },
              },
              {
                method: 'elementScroll',
                params: {
                  pixels: DEFAULT_PIXELS_TO_SCROLL,
                  selector: '#pane-side',
                  direction: 'vertical',
                  useCurrentScroll: true,
                },
              },
              { method: 'sleep', params: { time: 3000 } },
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
    {
      name: 'Search a conversation on WhatsApp Web',
      description: 'Use it to search an conversation on WhatsApp Web.',
      inputs: {
        conversation: {
          type: 'string',
          description: 'Conversation on WhatsApp.',
        },
      },
      steps: [
        {
          method: 'inputText',
          params: {
            selector: '[contenteditable="true"]',
            content: '{conversation}',
            sleep: 1500,
          },
        },
        { method: 'sleep', params: { time: 2000 } },
        {
          method: 'clickByCoordinates',
          params: {
            x: 0,
            y: 179,
          },
        },
      ],
      successMessage: 'WhatsApp conversation search completed successfully!',
    },
    {
      name: 'Send a message on WhatsApp Web',
      description: 'Use it to send a message on WhatsApp Web.',
      inputs: {
        message: {
          type: 'string',
          description: 'Message to send on WhatsApp Web.',
        },
      },
      steps: [
        {
          method: 'inputText',
          params: {
            selector:
              '#main > footer > div:nth-child(1) > div > span:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1)',
            content: '{message}',
            sleep: 1500,
          },
        },
        { method: 'sleep', params: { time: 2000 } },
        {
          method: 'click',
          params: {
            selector:
              '#main > footer > div:nth-child(1) > div > span:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > button',
          },
        },
      ],
      successMessage: 'Sending a message on WhatsApp completed successfully!',
    },
  ];

  const conversation = 'Wermeson Rocha';

  const memory = `
    WhatsApp Web:
    - Conversation: ${conversation}

    WhatsApp Web Login status: true
    `;

  const browserAgent = new BrowserAgent(skills, memory, {
    _id: 'testaiemployee',
  } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Login on WhatsApp Web', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web',
    });
    console.log(resultLogin);
  });

  test('List all conversations on WhatsApp Web', async () => {
    const resultList = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web and list all conversations',
    });
    console.log(resultList);
  });

  test('Search a conversation on WhatsApp Web', async () => {
    const resultSearch = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web and search a conversation',
    });
    console.log(resultSearch);
  });

  test('Send a message on WhatsApp Web', async () => {
    const resultSendMessage = await browserAgent.executorAgent.invoke({
      input:
        'Log in to WhatsApp Web, search a conversation, send a polite good morning message and greetings',
    });
    console.log(resultSendMessage);
  });
});
