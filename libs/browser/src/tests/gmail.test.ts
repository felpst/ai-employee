import 'dotenv/config';
import { BrowserAgent } from '../lib/browser';
import { Skill } from '../lib/browser.interfaces';
import { IAIEmployee } from '@cognum/interfaces';
import { AIEmployeeRepository } from '@cognum/ai-employee';
import { DatabaseHelper } from '@cognum/helpers';

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
          "name": "List emails on Gmail",
          "description": "Use this to list emails on Gmail.",
          "inputs": {},
          "steps": [
            { "method": "loadUrl", "params": { "url": "https://mail.google.com/" } },
            { "method": "dataExtraction", "params": { "container": "table.F.cf.zt > tbody ", "saveOn": "emails", "properties": [
              { "name": 'from', "selector": 'td.yX.xY div.yW > span > span', "innerAttribute": "email" },
              { "name": 'subject', "selector": 'td.xY.a4W div.xT > div.y6 > span > span', "type": "text" },
              { "name": 'date', "selector": 'td.xW.xY > span', "innerAttribute": "title"},
            ]}},
            { "method": "saveOnFile", "params": { "fileName": "gmail-emails", "memoryKey": "emails" } }
          ],
          "successMessage": "Emails available: {emails}."
      },
      {
        "name": "Search emails on Gmail",
        "description": "Use this to search emails on Gmail.",
        "inputs": {
          "search": {
            "type": "string",
            "description": "Search term."
          }
        },
        "steps": [
          { "method": "loadUrl", "params": { "url": "https://mail.google.com/" } },
          { "method": "inputText", "params": { "selector": "input[aria-label='Search in mail']", "content": "{search}" } },
          { "method": "pressKey", "params": { "key": "Enter", "sleep": 5000  }, },
          { "method": "dataExtraction", "params" : { "container": "div.ae4.UI.aZ6.id > div.Cp > div > table.F.cf.zt > tbody ", "saveOn": "emails", "properties": [
            { "name": 'from', "selector": 'td.yX.xY div.yW > span > span', "innerAttribute": "email" },
            { "name": 'subject', "selector": 'span.bog > span', "type": "text" },
            { "name": 'date', "selector": 'td.xW.xY > span', "innerAttribute": "title"},
          ]}},
          {"method": "saveOnFile", "params": { "fileName": "gmail-emails", "memoryKey": "emails" } }
        ],
        "successMessage": "Emails available: {emails}."
      },
      {
        "name": "Send email on Gmail",
        "description": "Use this to send email on Gmail.",
        "inputs": {
          "to": {
            "type": "string",
            "description": "Email address."
          },
          "subject": {
            "type": "string",
            "description": "Email subject."
          },
          "content": {
            "type": "string",
            "description": "Email content."
          }
        },
        "steps": [
          { "method": "loadUrl", "params": { "url": "https://mail.google.com/" } },
          { "method": "click", "params": { "selector": "div.T-I.T-I-KE.L3" } },
          { "method": "inputText", "params": { "selector": 'input[aria-label="To recipients"]', "content": "{to}", "sleep": 5000 } },
          { "method": "inputText", "params": { "selector": 'input[aria-label="Subject"]', "content": "{subject}", "sleep": 5000  } },
          { "method": "inputText", "params": { "selector": 'div.Am.Al.editable.LW-avf', "content": "{content}", "sleep": 5000 } },
          { "method": "click", "params": { "selector": 'div.T-I.J-J5-Ji.aoO.T-I-atl.L3', "sleep": 5000  } }
        ],
        "successMessage": "Email sent!"
      },
      {
        "name": "Read and reply email on Gmail",
        "description": "Use this to read and reply email on Gmail.",
        "inputs": {
          "emailToReplay": {
            "type": "string",
            "description": "Email address."
          }
        },
        "steps": [
          { "method": "loadUrl", "params": { "url": "https://mail.google.com/" } },
          { "method": "click", "params": {  "selector": "tr.zA:has(span.bA4 > span[email='{emailToReplay}'])", "sleep": 5000  } },
          { "method": "click", "params": {  "selector": "span.ams.bkH"  } },
          { "method": "dataExtraction",  "params": { "container": "div.nH.g.id", "saveOn": "emailsToReply", "properties": [
            {"name": "from", "selector": "span.gD", "innerAttribute": "email"},
            {"name": "subject", "selector": "h2.hP", "type": "text"},
            {"name": "content", "selector": "div.a3s.aiL", "type": "text"},
          ]}},
          {"method": "saveOnFile", "params": { "fileName": "gmail-email", "memoryKey": "emailsToReply", "sleep": 5000 } },
          {"method": "replyEmails", "params": {
            "emailsKey": "emailsToReply",
            "inputSelector": 'div[aria-label="Message Body"]',
            "buttonSelector": 'div[aria-label="Send"]'
          }}
        ],
        "successMessage": "Email replied!"
      }
    ];

    const email = process.env.GOOGLE_EMAIL;
    const password = process.env.GOOGLE_PASSWORD;
  
    const memory = `
    Google:
    - Email: ${email}
    - Password: ${password}
    - Search: "Giseli Oliveira"
    - To: "aiemployee+656f2003c01b342ae1059ee9@cognum.ai"
    - Subject: "Test email"
    - Content: "This is a test email. Please ignore it."
    - EmailToReplay: "alinem_oliveira@yahoo.com"
    `;

    const aiEmployeeRepo = new AIEmployeeRepository('654e4dace7a619a279bf9a55');
    const testEmployeeId = '659ed3258928300525d06484';
    const browserAgent = new BrowserAgent(skills, memory, { _id: testEmployeeId,} as IAIEmployee);
    let aiEmployee;

    beforeAll(async () => {
      await DatabaseHelper.connect(process.env.MONGO_URL);
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
        input: 'Login on Google',
      });
      console.log(JSON.stringify(result));
    });

    test('List emails on Gmail', async () => {
      const result = await browserAgent.executorAgent.invoke({
        input: 'List emails on Gmail',
      });
      console.log(JSON.stringify(result));
    });

    test('Search emails on Gmail', async () => {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Search emails on Gmail',
      });
      console.log(JSON.stringify(result));
    });

    test('Send email on Gmail', async () => {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Send email on Gmail',
      });
      console.log(JSON.stringify(result));
    });

    test('Read and reply email on Gmail', async () => {
      const result = await browserAgent.executorAgent.invoke({
        input: 'Read and reply email on Gmail',
      });
      console.log(JSON.stringify(result));
    });

});