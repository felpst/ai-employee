import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
  jest.setTimeout(600000);

  const skills: Skill[] = [
    {
      "name": "Login on Google",
      "description": "Use this to login on Google.",
      "inputs": {
        "email": {
          "type": "string",
          "description": "Email on Google account."
        },
        "password": {
          "type": "string",
          "description": "Password on Google account."
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://accounts.google.com/" } },
        { "method": "inputText", "params": { "selector": "#identifierId", "content": "{email}" } },
        { "method": "click", "params": { "selector": "#identifierNext", "sleep": 5000 } },
        { "method": "inputText", "params": { "selector": "input[name='Passwd']", "content": "{password}" } },
        { "method": "click", "params": { "selector": "#passwordNext", "sleep": 5000 } }
      ]
    },
    {
      "name": "Access Google Chat",
      "description": "Use this to access Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://chat.google.com/" } }
      ]
    },
    {
      "name": "List Rooms on Google Chat",
      "description": "Use this to list rooms on Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://chat.google.com/" } },
        { "method": "test", "params": { "container": "div.PQ2yBb" } },
        { "method": "switchToFrame", "params": { "selector": "iframe#gtn-roster-iframe-id" } },
        { "method": "dataExtraction", "params": { "container": "div.PQ2yBb > span", "saveOn": "rooms", "properties": [
          // { "name": 'selector', "selector": 'span.njhDLd.O5OMdc' },
          { "name": 'name', "selector": 'span.njhDLd.O5OMdc' },
        ]}},
        { "method": "dataExtraction", "params": { "container": "div.PQ2yBb > span", "saveOn": "rooms", "properties": [
          // { "name": 'selector', "selector": 'span.njhDLd.O5OMdc' },
          { "name": 'name', "selector": 'span.yue6if.jy2fzc' },
        ]}},
        { "method": "switchToDefaultContent" },
        { "method": "saveOnFile", "params": { "fileName": "google-chats-rooms", "memoryKey": "rooms" } }
      ]
    },
    {
      "name": "Open Message on Google Chat",
      "description": "Use this to open a message on Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "click", "params": { "selector": "#space/AAAAeXMMTpY/SCcFR", "sleep": 5000 } }
      ]
    }
  ]
  const email = process.env.GOOGLE_EMAIL
  const password = process.env.GOOGLE_PASSWORD

  // TODO: switch to personal email for testing
  const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}

    Google Login status: true
    `

  const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Google login', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'Login on Google'
    })
    console.log(resultLogin)
  });

  test('Select chat', async () => {
    const resultLogin = await browserAgent.executorAgent.invoke({
      input: 'List rooms on Google Chat'
    })
    console.log(resultLogin)
  });

  test('Google chat', async () => {
    try {
      const resultLogin = await browserAgent.executorAgent.invoke({
        input: 'Login on Google'
      })
      console.log(resultLogin)

      const resultAccess = await browserAgent.executorAgent.invoke({
        input: 'Access Google Chat'
      });
      console.log(resultAccess);

      const resultOpenMessage = await browserAgent.executorAgent.invoke({
        input: 'Open Message on Google Chat'
      });
      console.log(resultOpenMessage);
    } catch (error) {
      console.error(error);
    }
    expect(true).toBe(true);
  });
});
