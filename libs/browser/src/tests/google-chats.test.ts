import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';
import { DatabaseHelper } from '@cognum/helpers';
import { AIEmployeeRepository } from '@cognum/ai-employee';

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
      "name": "Select a chat on Google Chat",
      "description": "Use this to select a chat with person or space on Google Chat.",
      "inputs": {
        "roomType": {
          "type": "string",
          "description": "Type of the room (dm or space)"
        },
        "roomId": {
          "type": "string",
          "description": "Room ID"
        }
      },
      "steps": [
        { "method": "loadUrl", "params": { "url": "https://mail.google.com/chat/u/0/#chat/{roomType}/{roomId}" }, "successMessage": "Room selected: {roomId}." },
      ]
    },
    {
      "name": "Send message on Google Chat",
      "description": "Use this to send a message on Google Chat.",
      "inputs": {
        "message": {
          "type": "string",
          "description": "Message to be sent."
        }
      },
      "steps": [
        { "method": "switchToFrame", "params": { "selector": 'iframe.aAtlvd.bl' } },
        { "method": "inputText", "params": { "selector": 'div[role="textbox"]', "content": "{message}" } },
        { "method": "click", "params": { "selector": "button[aria-label='Send message']", "sleep": 5000 } },
        { "method": "switchToDefaultContent" },
      ],
      "successMessage": "Message sent: {message}."
    },
    {
      "name": "Read and reply messages on Google Chat",
      "description": "Use this to read and reply messages on Google Chat.",
      "inputs": {
        "roomType": {
          "type": "string",
          "description": "Type of the room (dm or space)"
        },
        "roomId": {
          "type": "string",
          "description": "Room ID"
        },
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
        
        { "method": "loadUrl", "params": { "url": "https://mail.google.com/chat/u/0/#chat/{roomType}/{roomId}" }, "successMessage": "Room selected: {roomId}." },
        { "method": "switchToFrame", "params": { "selector": 'iframe.aAtlvd.bl', "sleep": 5000, } },
        { "method": "dataExtraction", "params": { "container": "div.SvOPqd > c-wiz", "saveOn": "messages", "properties": [
          { "name": "name", "selector": "span.ZTmjQb.Z4BnXb",  "innerAttribute": 'data-name' },
          { "name": "email", "selector": "span.ZTmjQb.Z4BnXb", "innerAttribute": 'data-hovercard-id' },
          { "name": "messageContent", "selector": "div.Zc1Emd.QIJiHb", "type": "text" },
          { "name": "timestamp", "selector": "span.FvYVyf", "innerAttribute": "data-absolute-timestamp" },
        ]}},
        { "method": "switchToDefaultContent" },
        { "method": "saveOnFile", "params": { "fileName": "google-chats-messages", "memoryKey": "messages" } },
        { "method": "if", "params": { "condition": "browserMemory.messages[browserMemory.messages.length - 1].email != browserMemory.email", "steps": [
            {"method": "replyMessages", "params": {
              "messagesKey": "messages", 
              "inputSelector":'div[role="textbox"]', 
              "buttonSelector": "button[aria-label='Send message']"}}
        ]}},

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
    - RoomType: dm
    - RoomId: q-YlX0AAAAE
    - Message: Test message - Hello World!
    `

  const aiEmployeeRepo = new AIEmployeeRepository('654e4dace7a619a279bf9a55');
  const testEmployeeId = '659ed3258928300525d06484';
  const browserAgent = new BrowserAgent(skills, memory, { _id: testEmployeeId } as IAIEmployee);
  let aiEmployee;

  beforeAll(async () => {
    await DatabaseHelper.connect(process.env.MONGO_URL);
    // await aiEmployeeRepo.delete(testEmployeeId);
    aiEmployee = (await aiEmployeeRepo.create({
      _id: testEmployeeId,
      name: 'Adam',
      role: 'Software Engineer',
      tools: [],
    })) as IAIEmployee;
    
    await browserAgent.seed();
  });

  afterAll(async () => {
    await aiEmployeeRepo.delete(testEmployeeId);
    await DatabaseHelper.disconnect();
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
      input: 'Select a chat on Google Chat'
    })
    console.log(JSON.stringify(result))
  });

  test('Send message', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Send message on Google Chat'
    })
    console.log(JSON.stringify(result))
  });

  test('Read message', async () => {
    const result = await browserAgent.executorAgent.invoke({
      input: 'Read message on Google Chat'
    })
    console.log(JSON.stringify(result))

  });

});
