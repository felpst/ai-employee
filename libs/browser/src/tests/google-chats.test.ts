import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';
import * as treeify from 'treeify';

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
        { "method": "if", "params": { "condition": "!browserMemory.currentUrl.includes('myaccount.google.com')", "steps": [
          { "method": "inputText", "params": { "selector": "#identifierId", "content": "{email}" } },
          { "method": "click", "params": { "selector": "#identifierNext", "sleep": 5000 } },
          { "method": "inputText", "params": { "selector": "input[name='Passwd']", "content": "{password}" } },
          { "method": "click", "params": { "selector": "#passwordNext", "sleep": 5000 } }
        ]}},
      ],
      "successMessage": "Google Login successful!"
    },
    {
      "name": "List Rooms on Google Chat",
      "description": "Use this to list rooms on Google Chat.",
      "inputs": {},
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://chat.google.com/" } },
        { "method": "switchToFrame", "params": { "selector": "iframe#gtn-roster-iframe-id" } },
        { "method": "dataExtraction", "params": { "container": "div.PQ2yBb > span", "saveOn": "rooms", "properties": [
          { "name": 'id', "attribute": 'data-group-id', "required": true },
          { "name": 'name', "selector": 'span.njhDLd.O5OMdc', "required": true },
          { "name": 'unread', "selector": 'span.mL1cqe', "type": "boolean" },
        ]}},
        { "method": "dataExtraction", "params": { "container": "div.PQ2yBb > span", "saveOn": "rooms", "properties": [
          { "name": 'id', "attribute": 'data-group-id', "required": true },
          { "name": 'name', "selector": 'span.yue6if.jy2fzc', "required": true },
          { "name": 'unread', "selector": 'span.mL1cqe', "type": "boolean" },
        ]}},
        { "method": "switchToDefaultContent" },
        { "method": "saveOnFile", "params": { "fileName": "google-chats-rooms", "memoryKey": "rooms" } }
      ],
      "successMessage": "Google Chats available rooms: {rooms}."
    },
    {
      "name": "Open room on Google Chat",
      "description": "Use this to open a room with person or space on Google Chat.",
      "inputs": {
        "roomId": {
          "type": "string",
          "description": "Room ID"
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://mail.google.com/chat/u/0/#chat/{roomId}" }, "successMessage": "Room selected: {roomId}." },
      ]
    },
    // TODO - Send message
    // TODO - Read messages
    // TODO - Open unread room
  ]
  const email = process.env.GOOGLE_EMAIL
  const password = process.env.GOOGLE_PASSWORD

  // TODO: switch to personal email for testing
  const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}
    `

  const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

  beforeAll(async () => {
    await browserAgent.seed();
  });

  test('Google login', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Login on Google'
    })
    console.log(JSON.stringify(result))
  });

  test('List all rooms', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'List rooms on Google Chat'
    })
    console.log(JSON.stringify(result))
  });

  test('Select chat', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Start a chat with Aline.'
    })
    console.log(JSON.stringify(result))
  });

});
