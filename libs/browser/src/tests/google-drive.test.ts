import 'dotenv/config';
import { IAIEmployee } from '@cognum/interfaces';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

  const skills: Skill[] = [
    {
      name: 'Login on Google',
      description: 'Use this to login on Google.',
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
        { method: 'loadUrl', params: { url: 'https://accounts.google.com/' } },
        {
          method: 'if',
          params: {
            condition:
              "!browserMemory.currentUrl.includes('myaccount.google.com')",
            steps: [
              {
                method: 'inputText',
                params: { selector: '#identifierId', content: '{email}' },
              },
              {
                method: 'click',
                params: { selector: '#identifierNext', sleep: 5000 },
              },
              {
                method: 'inputText',
                params: {
                  selector: "input[name='Passwd']",
                  content: '{password}',
                },
              },
              {
                method: 'click',
                params: { selector: '#passwordNext', sleep: 5000 },
              },
            ],
          },
        },
      ],
      successMessage: 'Google Login successful!',
    },
    {
      name: 'List Files and Folders on Google Drive',
      description: 'Use this to list files on Google Drive.',
      inputs: {},
      steps: [
        {
          method: 'loadUrl',
          params: { url: 'https://drive.google.com/drive/my-drive' },
        },
        {
          method: 'dataExtraction',
          params: {
            container: 'div.WYuW0e',
            saveOn: 'folders',
            properties: [
              { name: 'id', attribute: 'data-id', required: true },
              { name: 'name', selector: 'div.KL4NAf', required: true },
              {
                method: 'if',
                params: {
                  condition: "document.querySelector('img.a-Ua-c') !== null",
                  steps: [
                    {
                      method: 'saveOnMemory',
                      params: { key: 'type', value: 'file' },
                    },
                  ],
                },
              },
            ],
          },
        },
        { method: 'switchToDefaultContent' },
        {
          method: 'saveOnFile',
          params: { fileName: 'google-documents', memoryKey: 'folders' },
        },
      ],
    },
    {
      name: 'List Files in Folders on Google Drive',
      description: 'Use this to list files in folders on Google Drive.',
      inputs: {
        folderId: {
          type: 'string',
          description: 'Folder ID',
        },
      },
      steps: [
        {
          method: 'loadUrl',
          params: { url: 'https://drive.google.com/drive/my-drive' },
        },
        {
          method: 'loadUrl',
          params: { url: 'https://drive.google.com/drive/folders/{folderId}' },
          successMessage: 'Folder selected: {folderId}.',
        },
        { method: 'switchToDefaultContent' },
        {
          method: 'saveOnFile',
          params: { fileName: 'google-documents', memoryKey: 'folders' },
        },
      ],
    },
    {
      name: 'Open Folder on Google Drive',
      description: 'Use this to open a folder on Google Drive.',
      inputs: {
        folderId: {
          type: 'string',
          description: 'Folder ID',
        },
      },
      steps: [
        {
          method: 'loadUrl',
          params: {
            url: 'https://drive.google.com/drive/folders/{folderId}',
            sleep: 10000,
          },
          successMessage: 'Folder selected: {folderId}.',
        },
      ],
    },
    {
      name: 'Delete Files on Google Drive',
      description: 'Use this to delete a files on Google Drive.',
      inputs: {
        fileId: {
          type: 'string',
          description: 'File ID',
        },
      },
      steps: [
        {
          method: 'loadUrl',
          params: { url: 'https://drive.google.com/drive/my-drive' },
        },
        {
          method: 'click',
          params: { selector: 'div[data-id="{fileId}"]', sleep: 10000 },
          successMessage: 'File selected',
        },
        {
          method: 'click',
          params: {
            selector:
              '#drive_main_page > div > div.g3Fmkb > div.S630me > div > div > div > div:nth-child(2) > div > div.a-s-tb-sc-Ja-Q.a-s-tb-sc-Ja-Q-Nm.a-Ba-Ed.a-s-Ba-ce > div > div.uEnUtd > div > div:nth-child(5) > div > div',
            sleep: 10000,
          },
        },
        {
          method: 'click',
          params: {
            selector:
              'body > div.ZACE2c.vMI2nb.dif24c.vhoiae.KkxPLb.eO2Zfd > div.xmQMab > div > div > div > div > div.OsLnq.IRlIld > div:nth-child(2) > button',
            sleep: 10000,
          },
          successMessage: 'Deleted File.',
        },
      ],
    },
  ];
  const email = process.env.GOOGLE_EMAIL;
  const password = process.env.GOOGLE_PASSWORD;

  const memory = `
  Google:
  - Email: ${email}
  - Password: ${password}
  `;

  const browserAgent = new BrowserAgent(skills, memory, {
    _id: 'testaiemployee',
  } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Google login', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Login on Google',
    });
    console.log(JSON.stringify(result));
  });

  test('Open Folder', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Open Isso é um teste Folder on Google Drive',
    });
    console.log(JSON.stringify(result));
  });

  test('List Files and Folders', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'List files and folders on Google Drive',
    });
    console.log(JSON.stringify(result));
  });

  test('List Files in Folders', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'List files in Isso é um teste Folder on Google Drive',
    });
    console.log(JSON.stringify(result));
  });

  test('Delete Files', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Delete Teste folder on Google Drive',
    });
    console.log(JSON.stringify(result));
  });
});
