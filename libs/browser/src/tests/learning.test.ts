import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('Skill Learning test', () => {
  jest.setTimeout(600000);

  const intermediateSteps = [
    {
      "action": {
        "tool": "Web Browser Load Page",
        "toolInput": {
          "url": "https://invest.xandr.com/login"
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Load Page\",\n  \"action_input\": {\n    \"url\": \"https://invest.xandr.com/login\"\n  }\n}\n```"
      },
      "observation": "Page loaded on web browser: https://invest.xandr.com/login"
    },
    {
      "action": {
        "tool": "Web Browser Input Text",
        "toolInput": {
          "textValue": "AIEmployee",
          "selectorId": 39
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"textValue\": \"AIEmployee\",\n    \"selectorId\": 39\n  }\n}\n```"
      },
      "observation": "Input AIEmployee was successfully done in element \"#anxs-login-username\""
    },
    {
      "action": {
        "tool": "Web Browser Click",
        "toolInput": {
          "selectorId": 51
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\": {\n    \"selectorId\": 51\n  }\n}\n```"
      },
      "observation": "The element \"#identity-check-button\" was clicked"
    },
    {
      "action": {
        "tool": "Web Browser Input Text",
        "toolInput": {
          "textValue": "aiemployee@cognum.ai",
          "selectorId": 26
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"textValue\": \"aiemployee@cognum.ai\",\n    \"selectorId\": 26\n  }\n}\n```"
      },
      "observation": "element not interactable\n  (Session info: chrome=120.0.6099.225)"
    },
    {
      "action": {
        "tool": "Web Browser Input Text",
        "toolInput": {
          "textValue": "aiemployee@cognum.ai",
          "selectorId": 54
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"textValue\": \"aiemployee@cognum.ai\",\n    \"selectorId\": 54\n  }\n}\n```"
      },
      "observation": "Input aiemployee@cognum.ai was successfully done in element \"#i0116\""
    },
    {
      "action": {
        "tool": "Web Browser Click",
        "toolInput": {
          "selectorId": 71
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\": {\n    \"selectorId\": 71\n  }\n}\n```"
      },
      "observation": "The element \"#idSIButton9\" was clicked"
    },
    {
      "action": {
        "tool": "Web Browser Input Text",
        "toolInput": {
          "textValue": "password123",
          "selectorId": 54
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"textValue\": \"password123\",\n    \"selectorId\": 54\n  }\n}\n```\n\n"
      },
      "observation": "element not interactable\n  (Session info: chrome=120.0.6099.225)"
    },
    {
      "action": {
        "tool": "Web Browser Input Text",
        "toolInput": {
          "textValue": "password123",
          "selectorId": 56
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"textValue\": \"password123\",\n    \"selectorId\": 56\n  }\n}\n```"
      },
      "observation": "Input password123 was successfully done in element \"#bmw-GridHeader > div:nth-child(1) > button:nth-child(8)\""
    },
    {
      "action": {
        "tool": "Web Browser Click",
        "toolInput": {
          "selectorId": 71
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\": {\n    \"selectorId\": 71\n  }\n}\n```"
      },
      "observation": "The element \"#root > main:nth-child(1) > div:nth-child(1) > main:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1)\" was clicked"
    },
    {
      "action": {
        "tool": "Web Browser Load Page",
        "toolInput": {
          "url": "https://invest.xandr.com/bmw/advertisers?state=all"
        },
        "log": "Action:\n```\n{\n  \"action\": \"Web Browser Load Page\",\n  \"action_input\": {\n    \"url\": \"https://invest.xandr.com/bmw/advertisers?state=all\"\n  }\n}\n```"
      },
      "observation": "Page loaded on web browser: https://invest.xandr.com/bmw/advertisers?state=all"
    }
  ];

  test('Should learn a skill', async () => {
    const browserAgent = new BrowserAgent([], '');
    await browserAgent.seed();

    const skillDir = path.join('.', 'tmp', 'skills');
    const oldFileCountInDir = await fs.readdir(skillDir)
      .then(read => read.length)
      .catch(() => 0);

    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'login to xandr',
        steps: intermediateSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const newFileCountInDir = (await fs.readdir(skillDir)).length;

    expect(newFileCountInDir).toBe(oldFileCountInDir + 1);
  });
});
