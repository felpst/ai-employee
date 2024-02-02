import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { DatabaseHelper } from '@cognum/helpers';
import mongoose, { Model, Schema } from 'mongoose';

const programScheduleExtractionSteps = [{
  "action": {
    "tool": "Web Browser Load Url",
    "toolInput": {
      "url": "https://recordtv.r7.com/programacao"
    },
    "log": "Self Locate: I am on a new tab page with the title \"Nova guia\" which is Portuguese for \"New Tab\". The visible HTML confirms this as it contains a basic structure without any content related to a specific website.\n\nThought: To extract the programming schedule from the Record TV website, I need to navigate to the provided URL. I will use the Web Browser Load Url tool to load the page.\n\nAction:\n```\n{\n  \"action\": \"Web Browser Load Url\",\n  \"action_input\": {\n    \"url\": \"https://recordtv.r7.com/programacao\"\n  }\n}\n```\n\n"
  },
  "observation": "Success: Page loaded!\n\nService Input:\n```json\n{\n  \"url\": \"https://recordtv.r7.com/programacao\"\n}\n```\n\nService Response: Current page is now \"https://recordtv.r7.com/programacao\""
},
{
  "action": {
    "tool": "Web Browser Data Extraction",
    "toolInput": {
      "selectorId": 1106,
      "properties": [
        {
          "name": "time",
          "selectorId": "1109",
          "required": true,
          "type": "string"
        },
        {
          "name": "title",
          "selectorId": "1115",
          "required": true,
          "type": "string"
        },
        {
          "name": "duration",
          "selectorId": "1116",
          "required": true,
          "type": "string"
        }
      ],
      "saveOn": "recordTVProgramming"
    },
    "log": "Self Locate: I am on the Record TV programming page, as indicated by the page title \"Programação Record TV - Acompanhe a Emissora\" and the current URL in the browser tab which is \"https://recordtv.r7.com/programacao\".\n\nThought: Now that I am on the correct page, I need to extract the programming schedule. The visible HTML shows a list of program times and titles within an ordered list element (ol) with a selector-id of \"1106\". I will use the Web Browser Data Extraction tool to extract the data from this list.\n\nAction:\n```\n{\n  \"action\": \"Web Browser Data Extraction\",\n  \"action_input\": {\n    \"selectorId\": 1106,\n    \"properties\": [\n      {\n        \"name\": \"time\",\n        \"selectorId\": \"1109\",\n        \"required\": true,\n        \"type\": \"string\"\n      },\n      {\n        \"name\": \"title\",\n        \"selectorId\": \"1115\",\n        \"required\": true,\n        \"type\": \"string\"\n      },\n      {\n        \"name\": \"duration\",\n        \"selectorId\": \"1116\",\n        \"required\": true,\n        \"type\": \"string\"\n      }\n    ],\n    \"saveOn\": \"recordTVProgramming\"\n  }\n}\n```\n\n"
  },
  "observation": "Success: The data was extracted!\n\nService Input:\n```json\n{\n  \"container\": \"div:nth-child(8) > div:nth-child(1) > div > div > div > div:nth-child(2) > ol\",\n  \"properties\": [\n    {\n      \"name\": \"time\",\n      \"required\": true,\n      \"type\": \"string\",\n      \"selector\": \"ol > li > div > time\"\n    },\n    {\n      \"name\": \"title\",\n      \"required\": true,\n      \"type\": \"string\",\n      \"selector\": \"ol > li > div > div > strong\"\n    },\n    {\n      \"name\": \"duration\",\n      \"required\": true,\n      \"type\": \"string\",\n      \"selector\": \"ol > li > div > div > p\"\n    }\n  ]\n}\n```\n\nService Response: Data extraction completed: 23 rows. \nFirst 5 results: \n```json\n[\n  {\n    \"time\": \"05h00\",\n    \"title\": \"Balanço Geral Manhã\",\n    \"duration\": \"05h00 - 07h00\"\n  },\n  {\n    \"time\": \"07h00\",\n    \"title\": \"Jornal da Record - 24h\",\n    \"duration\": \"07h00 - 07h05\"\n  },\n  {\n    \"time\": \"07h05\",\n    \"title\": \"Balanço Geral Manhã\",\n    \"duration\": \"07h05 - 07h30\"\n  },\n  {\n    \"time\": \"07h30\",\n    \"title\": \"Programação Local\",\n    \"duration\": \"07h30 - 08h40\"\n  },\n  {\n    \"time\": \"08h40\",\n    \"title\": \"Fala Brasil\",\n    \"duration\": \"08h40 - 10h00\"\n  }\n]\n```"
}];

const xandrLoginSteps = [
  {
    "action": {
      "tool": "Web Browser Load Url",
      "tool_input": {
        "url": "https://monetize.xandr.com/login"
      }
    },
    "log": "Self Locate: I am on a new tab page in the browser, as indicated by the page title \"Nova guia\" and the URL \"chrome://new-tab-page/\".\n\nThought: To login to Xandr, I need to navigate to the Xandr login page. I will use the Web Browser Load Url tool to load the Xandr login URL.\n\nAction:\n```\n{\n  \"action\": \"Web Browser Load Url\",      \"action_input\": {        \"url\": \"https://monetize.xandr.com/login\"      }    }    ```",
    "observation": "Success: Page loaded!\n\nService Input:\n```json\n{\n  \"url\": \"https://monetize.xandr.com/login\"\n}\n```\n\nService Response: Current page is now \"https://monetize.xandr.com/login\""
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "tool_input": {
        "content": "AIEmployee",
        "selector": "#anxs-login-username"
      }
    },
    "log": "Self Locate: I am on the Xandr login page, as indicated by the page title \"Sign In\" and the current URL \"https://monetize.xandr.com/login\".\n\nThought: To proceed with the login, I need to input the username into the username field. I will use the Web Browser Input Text tool to input the provided username \"AIEmployee\" into the input field with selector-id \"33\".\n\nAction:\n\n{\n \"action\": \"Web Browser Input Text\",\n \"action_input\": {\n \"content\": \"AIEmployee\",\n \"selectorId\": 33\n }\n}\n",
    "observation": "Success: Input was done!\n\nService Input:\njson\n{\n \"selector\": \"#anxs-login-username\",\n \"content\": \"AIEmployee\"\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Click",
      "tool_input": {
        "selectorId": 45
      }
    },
    "log": "Self Locate: I am on the Xandr login page, as indicated by the page title \"Sign In\" and the current URL \"https://monetize.xandr.com/login\".\n\nThought: Now that the username has been entered, the next step is to click the \"Next\" button to proceed to the password entry step. I will use the Web Browser Click tool to click the button with selector-id \"45\".\n\nAction:\n\n{\n \"action\": \"Web Browser Click\",\n \"action_input\": {\n \"selectorId\": 45\n }\n}\n",
    "observation": "Success: The element was clicked!\n\nService Input:\njson\n{\n \"selector\": \"#identity-check-button\",\n \"ignoreNotExists\": false\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "tool_input": {
        "content": "aiemployee@cognum.ai",
        "selectorId": 33
      }
    },
    "log": "Self Locate: I am on the Microsoft login page, as indicated by the page title \"Entrar em sua conta\" and the current URL containing \"login.microsoftonline.com\".\n\nThought: Since I am on the Microsoft login page, I need to input the Microsoft email provided in the memory into the username field. I will use the Web Browser Input Text tool to input the email \"aiemployee@cognum.ai\" into the input field with selector-id \"33\".\n\nAction:\n\n{\n \"action\": \"Web Browser Input Text\",\n \"action_input\": {\n \"content\": \"aiemployee@cognum.ai\",\n \"selectorId\": 33\n }\n}\n",
    "observation": "Error: element not interactable\n (Session info: chrome=121.0.6167.86)\n\nService Input:\njson\n{\n \"selector\": \"#lightbox > div:nth-child(3) > div > div > div > div:nth-child(3)\",\n \"content\": \"aiemployee@cognum.ai\"\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "tool_input": {
        "content": "aiemployee@cognum.ai",
        "selectorId": 31
      }
    },
    "log": "Self Locate: I am on the Microsoft login page, as indicated by the page title \"Entrar em sua conta\" and the current URL containing \"login.microsoftonline.com\".\n\nThought: The previous action to input text into the username field failed because the element was not interactable. This could be due to the element being hidden, disabled, or not the correct field for input. I need to identify the correct input field for the email address. The correct selector-id for the email input field is \"31\" as per the provided HTML context.\n\nAction:\n\n{\n \"action\": \"Web Browser Input Text\",\n \"action_input\": {\n \"content\": \"aiemployee@cognum.ai\",\n \"selectorId\": 31\n }\n}\n",
    "observation": "Success: Input was done!\n\nService Input:\njson\n{\n \"selector\": \"#i0116\",\n \"content\": \"aiemployee@cognum.ai\"\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Click",
      "tool_input": {
        "selectorId": 48
      }
    },
    "log": "Self Locate: I am on the Microsoft login page, as indicated by the page title \"Entrar em sua conta\" and the current URL containing \"login.microsoftonline.com\".\n\nThought: Now that the email has been entered, the next step is to click the \"Next\" button to proceed to the password entry step. I will use the Web Browser Click tool to click the button with selector-id \"48\".\n\nAction:\n\n{\n \"action\": \"Web Browser Click\",\n \"action_input\": {\n \"selectorId\": 48\n }\n}\n",
    "observation": "Success: The element was clicked!\n\nService Input:\njson\n{\n \"selector\": \"#idSIButton9\",\n \"ignoreNotExists\": false\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "tool_input": {
        "content": "password123",
        "selectorId": 27
      }
    },
    "log": "Self Locate: I am on the Microsoft login page, as indicated by the page title \"Entrar em sua conta\" and the current URL containing \"login.microsoftonline.com\".\n\nThought: I need to identify the correct input field for the password. The correct selector-id for the password input field is \"27\" as per the provided HTML context.\n\nAction:\n\n{\n \"action\": \"Web Browser Input Text\",\n \"action_input\": {\n \"content\": \"password123\",\n \"selectorId\": 27\n }\n}\n",
    "observation": "Success: Input was done!\n\nService Input:\njson\n{\n \"selector\": \"#i0116\",\n \"content\": \"password123\"\n}\n"
  },
  {
    "action": {
      "tool": "Web Browser Click",
      "tool_input": {
        "selectorId": 44
      }
    },
    "log": "Self Locate: I am on the Microsoft login page, as indicated by the page title \"Entrar em sua conta\" and the current URL containing \"login.microsoftonline.com\".\n\nThought: Now that the password has been entered, the next step is to click the \"Sign In\" button to finish login. I will use the Web Browser Click tool to click the button with selector-id \"44\".\n\nAction:\n\n{\n \"action\": \"Web Browser Click\",\n \"action_input\": {\n \"selectorId\": 44\n }\n}\n",
    "observation": "Success: The element was clicked!\n\nService Input:\njson\n{\n \"selector\": \"#idSIButton9\",\n \"ignoreNotExists\": false\n}\n"
  }
];

const linkedinExtractLeadsSteps = [
  {
    action: {
      tool: "Web Browser Load Page",
      toolInput: {
        url: "https://www.linkedin.com/feed/"
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Load Page\",\n  \"action_input\"\: {\n    \"url\": \"https://www.linkedin.com/feed/\"\n  }\n}\n```"
    },
    observation: "Page loaded on web browser: https://www.linkedin.com/feed/"
  },
  {
    action: {
      tool: "Web Browser Input Text",
      toolInput: {
        textValue: "Software Engineer",
        "selectorId": 39
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\"\: {\n    \"textValue\": \"AIEmployee\",\n    \"selectorId\": 39\n  }\n}\n```"
    },
    observation: "Input AIEmployee was successfully done in element \"#global-nav-typeahead > input\""
  },
  {
    action: {
      tool: "Web Browser Key Up Press",
      toolInput: {
        key: "Enter"
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Key Up Press\",\n  \"action_input\"\: {\n    \"key\": \"Enter\"\n  }\n}\n```"
    },
    observation: "Key \"Enter\" pressed"
  },
  {
    action: {
      tool: "Web Browser Click",
      toolInput: {
        "selectorId": 26
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\"\: {\n   \"selectorId\": 26\n  }\n}\n```"
    },
    observation: "element not interactable\n  (Session info: chrome=120.0.6099.225)"
  },
  {
    action: {
      tool: "Web Browser Click",
      toolInput: {
        "selectorId": 26
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\"\: {\n   \"selectorId\": 26\n  }\n}\n```"
    },
    observation: "Element \"#search-reusables__filters-bar > ul > li:nth-child(3) > button\" was successfully clicked"
  },
  {
    action: {
      tool: "Web Browser Extract Data",
      toolInput: {
        selectorId: 54,
        saveOn: "leads",
        properties: [
          { name: "name", selector: "a:nth-child(1) > span:nth-child(1) > span:nth-child(1)" },
          { name: "profission", selector: ".entity-result__primary-subtitle" },
          { name: "city", selector: ".entity-result__secondary-subtitle" },
          { name: "current", selector: ".entity-result__summary" },
          { name: "link", selector: ".app-aware-link", attribute: "href" }
        ]
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_input\"\: {\n    \"selectorId\": 54,\n    \"saveOn\": \"leads\",\n    \"properties\": [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
    },
    observation: "Successfully extracted data for container \"li.reusable-search__result-container\""
  },
  {
    action: {
      tool: "Web Browser scroll",
      toolInput: {
        direction: "Vertical",
        scrollTo: "1600",
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_input\"\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
    },
    observation: "Successfully scrolled 1600px vertically."
  },
  {
    action: {
      tool: "Web Browser Click",
      toolInput: {
        selectorId: 71,
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\"\: {\n    \"selectorId\": 71\n  }\n}\n```"
    },
    observation: "The element \".artdeco-pagination__button--next\" was clicked"
  },
  {
    action: {
      tool: "Web Browser Extract Data",
      toolInput: {
        selectorId: 54,
        saveOn: "leads",
        properties: [
          { name: "name", selector: "a:nth-child(1) > span:nth-child(1) > span:nth-child(1)" },
          { name: "profission", selector: ".entity-result__primary-subtitle" },
          { name: "city", selector: ".entity-result__secondary-subtitle" },
          { name: "current", selector: ".entity-result__summary" },
          { name: "link", selector: ".app-aware-link", attribute: "href" }
        ]
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_input\"\: {\n    \"selectorId\": 54,\n    \"saveOn\": \"leads\",\n    \"properties\": [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
    },
    observation: "Successfully extracted data for container \"li.reusable-search__result-container\""
  },
  {
    action: {
      tool: "Web Browser scroll",
      toolInput: {
        direction: "Vertical",
        scrollTo: "1600",
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_input\"\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
    },
    observation: "Successfully scrolled 1600px vertically."
  },
  {
    action: {
      tool: "Web Browser Click",
      toolInput: {
        selectorId: 71,
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\"\: {\n    \"selectorId\": 71\n  }\n}\n```"
    },
    observation: "The element \".artdeco-pagination__button--next\" was clicked"
  },
  {
    action: {
      tool: "Web Browser Extract Data",
      toolInput: {
        selectorId: 54,
        saveOn: "leads",
        properties: [
          { name: "name", selector: "a:nth-child(1) > span:nth-child(1) > span:nth-child(1)" },
          { name: "profission", selector: ".entity-result__primary-subtitle" },
          { name: "city", selector: ".entity-result__secondary-subtitle" },
          { name: "current", selector: ".entity-result__summary" },
          { name: "link", selector: ".app-aware-link", attribute: "href" }
        ]
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_input\"\: {\n    \"selectorId\": 54,\n    \"saveOn\": \"leads\",\n    \"properties\": [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
    },
    observation: "Successfully extracted data for container \"li.reusable-search__result-container\""
  },
  {
    action: {
      tool: "Web Browser scroll",
      toolInput: {
        direction: "Vertical",
        scrollTo: "1600",
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_input\"\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
    },
    observation: "Successfully scrolled 1600px vertically."
  },
  {
    action: {
      tool: "Web Browser Click",
      toolInput: {
        selectorId: 71,
      },
      log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\"\: {\n    \"selectorId\": 71\n  }\n}\n```"
    },
    observation: "The element \".artdeco-pagination__button--next\" was clicked"
  },
];

const linkedinLoginSteps = [
  {
    "action": {
      "tool": "Web Browser Load Url",
      "toolInput": {
        "url": "https://www.linkedin.com/login"
      },
      "log": "Self Locate: I am on a new tab page in the browser, as indicated by the page title \"Nova guia\" and the URL \"chrome://new-tab-page/\".\n\nThought: To log in to LinkedIn, I need to navigate to the LinkedIn website first. I will use the Web Browser Load Url tool to load the LinkedIn login page.\n\nAction:\n```json\n{\n  \"action\": \"Web Browser Load Url\",\n  \"action_input\": {\n    \"url\": \"https://www.linkedin.com/login\"\n  }\n}\n```\n\n"
    },
    "observation": "Success: Page loaded!\n\nService Input:\n```json\n{\n  \"url\": \"https://www.linkedin.com/login\"\n}\n```\n\nService Response: Current page is now \"https://www.linkedin.com/login\""
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "toolInput": {
        "content": "aiemployee@cognum.ai",
        "selectorId": 33
      },
      "log": "Self Locate: I am on the LinkedIn login page, as indicated by the page title \"Entrar ou cadastrar-se no LinkedIn | LinkedIn\" and the current URL \"https://www.linkedin.com/login\".\n\nThought: Now that I am on the LinkedIn login page, I need to input the provided test credentials into the appropriate fields and then click the login button.\n\nAction:\n```json\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"content\": \"aiemployee@cognum.ai\",\n    \"selectorId\": 33\n  }\n}\n```\n\n"
    },
    "observation": "Success: Input was done!\n\nService Input:\n```json\n{\n  \"selector\": \"#username\",\n  \"content\": \"aiemployee@cognum.ai\"\n}\n```"
  },
  {
    "action": {
      "tool": "Web Browser Input Text",
      "toolInput": {
        "content": "gWHT#TDBtw7Z#,@",
        "selectorId": 59
      },
      "log": "Action:\n```json\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_input\": {\n    \"content\": \"gWHT#TDBtw7Z#,@\",\n    \"selectorId\": 59\n  }\n}\n```\n\n"
    },
    "observation": "Success: Input was done!\n\nService Input:\n```json\n{\n  \"selector\": \"#password\",\n  \"content\": \"gWHT#TDBtw7Z#,@\"\n}\n```"
  },
  {
    "action": {
      "tool": "Web Browser Click",
      "toolInput": {
        "selectorId": 65
      },
      "log": "Action:\n```json\n{\n  \"action\": \"Web Browser Click\",\n  \"action_input\": {\n    \"selectorId\": 65\n  }\n}\n```\n\n\n\n"
    },
    "observation": "Success: The element was clicked!\n\nService Input:\n```json\n{\n  \"selector\": \"#organic-div > form > div:nth-child(30) > button\",\n  \"ignoreNotExists\": false\n}\n```"
  }
];

const w3TableExtractionSteps = [
  {
    "action": {
      "tool": "Web Browser Load Url",
      "toolInput": {
        "url": "https://www.w3schools.com/html/html_tables.asp"
      },
      "log": "Self Locate: I am currently on a new tab page in the browser, as indicated by the page title \"Nova guia\" and the URL \"chrome://new-tab-page/\".\nThought: To extract the table from the W3Schools Example page, I first need to navigate to the URL provided by the user.\nAction:\n```\n{\n  \"action\": \"Web Browser Load Url\",\n  \"action_input\": {\n    \"url\": \"https://www.w3schools.com/html/html_tables.asp\"\n  }\n}\n```"
    },
    "observation": "Success: Page loaded!\n\nService Input:\n```json\n{\n  \"url\": \"https://www.w3schools.com/html/html_tables.asp\"\n}\n```\n\nService Response: Current page is now \"https://www.w3schools.com/html/html_tables.asp\""
  },
  {
    "action": {
      "tool": "Web Browser Data Extraction",
      "toolInput": {
        "selectorId": 1322,
        "properties": [
          {
            "name": "Company",
            "selectorId": "1329",
            "type": "string"
          },
          {
            "name": "Contact",
            "selectorId": "1330",
            "type": "string"
          },
          {
            "name": "Country",
            "selectorId": "1331",
            "type": "string"
          }
        ],
        "saveOn": "extractedTableData"
      },
      "log": "Self Locate: I am on the W3Schools HTML Tables page, as indicated by the page title \"HTML Tables\" and the current URL in the browser tab \"https://www.w3schools.com/html/html_tables.asp\".\nThought: Now that I am on the correct page, I can proceed to extract the data from the example table with the id \"customers\".\nAction:\n```\n{\n  \"action\": \"Web Browser Data Extraction\",\n  \"action_input\": {\n    \"selectorId\": 1322,\n    \"properties\": [\n      {\n        \"name\": \"Company\",\n        \"selectorId\": \"1329\",\n        \"type\": \"string\"\n      },\n      {\n        \"name\": \"Contact\",\n        \"selectorId\": \"1330\",\n        \"type\": \"string\"\n      },\n      {\n        \"name\": \"Country\",\n        \"selectorId\": \"1331\",\n        \"type\": \"string\"\n      }\n    ],\n    \"saveOn\": \"extractedTableData\"\n  }\n}\n```\n"
    },
    "observation": "Success: The data was extracted!\n\nService Input:\n```json\n{\n  \"container\": \"#customers > tbody\",\n  \"properties\": [\n    {\n      \"name\": \"Company\",\n      \"type\": \"string\",\n      \"selector\": \"td:nth-child(1)\"\n    },\n    {\n      \"name\": \"Contact\",\n      \"type\": \"string\",\n      \"selector\": \"td:nth-child(2)\"\n    },\n    {\n      \"name\": \"Country\",\n      \"type\": \"string\",\n      \"selector\": \"td:nth-child(3)\"\n    }\n  ]\n}\n```\n\nService Response: Data extraction completed: 6 rows. \nFirst 5 results: \n```json\n[\n  {\n    \"Company\": \"Alfreds Futterkiste\",\n    \"Contact\": \"Maria Anders\",\n    \"Country\": \"Germany\"\n  },\n  {\n    \"Company\": \"Centro comercial Moctezuma\",\n    \"Contact\": \"Francisco Chang\",\n    \"Country\": \"Mexico\"\n  },\n  {\n    \"Company\": \"Ernst Handel\",\n    \"Contact\": \"Roland Mendel\",\n    \"Country\": \"Austria\"\n  },\n  {\n    \"Company\": \"Island Trading\",\n    \"Contact\": \"Helen Bennett\",\n    \"Country\": \"UK\"\n  },\n  {\n    \"Company\": \"Laughing Bacchus Winecellars\",\n    \"Contact\": \"Yoshi Tannamuri\",\n    \"Country\": \"Canada\"\n  }\n]\n```"
  }
];

let skillModel: Model<any>;
beforeAll(async () => {
  await DatabaseHelper.connect(process.env.MONGO_URL);
  const SkillSchema = new Schema({}, { strict: false });
  skillModel = mongoose.model('Skill', SkillSchema, 'skills');
});
afterAll(async () => {
  await DatabaseHelper.disconnect();
});

describe('Skill Learning test', () => {
  jest.setTimeout(600000);

  test('Should learn Xandr Login', async () => {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Login to Xandr',
        steps: xandrLoginSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should learn Linkedin Lead Extraction and make a loop for repeating actions', async () => {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Extract 3 pages of Software Engineers from linkedin',
        steps: linkedinExtractLeadsSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should learn Linkedin Login and with an if condition', async () => {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Login to LinkedIn',
        steps: linkedinLoginSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should learn Record programs schedule extraction', async () => {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Extraia a programação da Record',
        steps: programScheduleExtractionSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should learn W3 Table Example extraction', async () => {
    const browserAgent = new BrowserAgent();
    await browserAgent.seed();

    const countBefore = await skillModel.count();
    try {
      const result = await browserAgent.learnerAgent.invoke({
        task: 'Extract W3Schools Example table https://www.w3schools.com/html/html_tables.asp',
        steps: w3TableExtractionSteps
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    const countAfter = await skillModel.count();

    expect(countAfter).toBe(countBefore + 1);
  });
});
