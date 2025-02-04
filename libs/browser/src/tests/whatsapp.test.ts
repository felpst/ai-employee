import { AIEmployeeRepository } from '@cognum/ai-employee';
import { IAIEmployee } from '@cognum/interfaces';
import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';
import { DatabaseHelper } from '@cognum/helpers';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);
  // Empirical: From here on it does not repeat values in extraction
  const DEFAULT_PIXELS_TO_SCROLL = 1450;
  const aiEmployeeRepo = new AIEmployeeRepository('654e4dace7a619a279bf9a55');
  const testEmployeeId = '659ed3258928300525d06484';

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
      name: 'List conversations on WhatsApp Web',
      description: 'Use it to list conversations on WhatsApp Web.',
      inputs: {},
      steps: [
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
        {
          method: 'loop',
          params: {
            times: 3,
            steps: [
              {
                method: 'dataExtraction',
                params: {
                  container: '#pane-side > div:nth-child(1) > div > div',
                  saveOn: 'whatsApp-chats',
                  properties: [
                    {
                      name: 'name',
                      selector:
                        'div > div:nth-child(2) > div:nth-child(1) > div > div > span',
                      type: 'string',
                      required: true,
                    },
                    {
                      name: 'date',
                      selector:
                        'div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > span',
                      type: 'string',
                      required: true,
                    },
                    {
                      name: 'lastMessage',
                      selector:
                        'div > div:nth-child(2) > div:nth-child(2) > div > span',
                      type: 'string',
                      required: true,
                    },
                    {
                      name: 'unread',
                      selector:
                        'div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span > div > span',
                      innerAttribute: 'aria-label',
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
          params: {
            fileName: 'whatsApp-chats',
            memoryKey: 'whatsApp-chats',
          },
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
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
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
        conversation: {
          type: 'string',
          description: 'Conversation on WhatsApp.',
        },
        message: {
          type: 'string',
          description: 'Message to send on WhatsApp Web.',
        },
      },
      steps: [
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
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
    {
      name: 'Read and reply messages on WhatsApp Web',
      description: 'Use this to read and reply messages on WhatsApp Web.',
      inputs: {},
      steps: [
        { method: 'loadUrl', params: { url: 'https://web.whatsapp.com/' } },
        { method: 'sleep', params: { time: 4000 } },
        {
          method: 'dataExtraction',
          params: {
            container: '#pane-side > div:nth-child(1) > div > div',
            saveOn: 'whatsApp-chats',
            properties: [
              {
                name: 'name',
                selector:
                  'div > div:nth-child(2) > div:nth-child(1) > div > div > span',
                type: 'string',
                required: true,
              },
              {
                name: 'lastMessage',
                selector:
                  'div > div:nth-child(2) > div:nth-child(2) > div > span',
                type: 'string',
                required: true,
              },
              {
                name: 'unread',
                selector:
                  'div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span > div > span',
                innerAttribute: 'aria-label',
              },
            ],
          },
        },
        {
          method: 'saveOnFile',
          params: { fileName: 'whatsApp-chats', memoryKey: 'whatsApp-chats' },
        },
        {
          method: 'replyWhatsApp',
          params: { whatsKey: 'whatsApp-chats' },
        },
      ],
      successMessage:
        'Read and reply messages on WhatsApp completed successfully!',
    },
  ];

  const conversation = '';

  const memory = `
    WhatsApp Web:
    - Conversation: ${conversation}

    WhatsApp Web Login status: true
    `;

  const browserAgent = new BrowserAgent(skills, memory, {
    _id: testEmployeeId,
    role: 'Software Engineer',
    tools: [],
  } as IAIEmployee);

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);

    try {
      await aiEmployeeRepo.delete(testEmployeeId);
    } catch (_) {}

    await aiEmployeeRepo.create({
      _id: testEmployeeId,
      name: 'Adam',
      role: 'Software Engineer',
      tools: [],
    });

    await browserAgent.seed();
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(testEmployeeId);
    await DatabaseHelper.disconnect();
  });

  test('Login on WhatsApp Web', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Log in on WhatsApp Web',
    });
    console.log(resultLogin);
  });

  test('List conversations on WhatsApp Web', async () => {
    const resultList = await browserAgent.executorAgent.invoke({
      input: 'List conversations on WhatsApp Web',
    });
    console.log(resultList);
  });

  test('Search a conversation on WhatsApp Web', async () => {
    const resultSearch = await browserAgent.executorAgent.invoke({
      input: 'Search a conversation on WhatsApp Web',
    });
    console.log(resultSearch);
  });

  test('Send a message on WhatsApp Web', async () => {
    const resultSendMessage = await browserAgent.executorAgent.invoke({
      input:
        'Send a polite good afternoon message/greetings to a conversation on WhatsApp Web',
    });
    console.log(resultSendMessage);
  });

  test('Read messages on WhatsApp Web', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Read and reply messages on WhatsApp Web',
    });
    console.log(JSON.stringify(result));
  });
});
