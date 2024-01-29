import { IntermediateSteps } from '.';

export namespace LinkedinSteps {
  export const login: IntermediateSteps = [
    {
      action: {
        tool: "Web Browser Load Page",
        toolInput: {
          url: "https://www.linkedin.com/login"
        },
        log: "Self Locate: I am on a new tab page in the browser, as indicated by the page title \"Nova guia\" and the URL \"chrome://new-tab-page/\".\nThought: Since I am on a new tab page, I need to load the LinkedIn login page to proceed with the login process.\n\nAction:\n```\n{\n  \"action\": \"Web Browser Load Page\",\n  \"action_inpu\: {\n    \"url\": \"https://www.linkedin.com/login\"\n  }\n}\n```\n"
      },
      observation: "Page loaded on web browser: https://www.linkedin.com/login"
    },
    {
      action: {
        tool: "Web Browser Input Text",
        toolInput: {
          textValue: "aiemployee@cognum.ai",
          selectorId: 96
        },
        log: "Self Locate: I am on the LinkedIn login page, as indicated by the page title \"Entrar ou cadastrar-se no LinkedIn | LinkedIn\" and the current URL in the browser tab \"https://www.linkedin.com/login\".\nThought: Since I am on the LinkedIn login page, I need to input the provided test credentials into the email and password fields and then click the login button to perform the login action.\n\nAction:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_inpu\: {\n    \"textValue\": \"aiemployee@cognum.ai\",\n    \"selectorId\": 96\n  }\n}\n```\n\n"
      },
      observation: "Input aiemployee@cognum.ai was successfully done in element \"#username\""
    },
    {
      action: {
        tool: "Web Browser Input Text",
        toolInput: {
          textValue: "gWHT#TDBtw7Z#,@",
          selectorId: 122
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_inpu\: {\n    \"textValue\": \"gWHT#TDBtw7Z#,@\",\n    \"selectorId\": 122\n  }\n}\n```\n\n"
      },
      observation: "Input gWHT#TDBtw7Z#,@ was successfully done in element \"#password\""
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          selectorId: 128
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n    \"selectorId\": 128\n  }\n}\n```"
      },
      observation: "The element \"#organic-div > form:nth-child(2) > div:nth-child(30) > button:nth-child(1)\" was clicked"
    }
  ];
  export const extractLeads: IntermediateSteps = [
    {
      action: {
        tool: "Web Browser Load Page",
        toolInput: {
          url: "https://www.linkedin.com/feed/"
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Load Page\",\n  \"action_inpu\: {\n    \"url\": \"https://www.linkedin.com/feed/\"\n  }\n}\n```"
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Input Text\",\n  \"action_inpu\: {\n    \"textValue\": \"AIEmployee\",\n    \"selectorId\": 39\n  }\n}\n```"
      },
      observation: "Input AIEmployee was successfully done in element \"#global-nav-typeahead > input\""
    },
    {
      action: {
        tool: "Web Browser Key Up Press",
        toolInput: {
          key: "Enter"
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Key Up Press\",\n  \"action_inpu\: {\n    \"key\": \"Enter\"\n  }\n}\n```"
      },
      observation: "Key \"Enter\" pressed"
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          "selectorId": 26
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n   \"selectorId\": 26\n  }\n}\n```"
      },
      observation: "element not interactable\n  (Session info: chrome=120.0.6099.225)"
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          "selectorId": 26
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n   \"selectorId\": 26\n  }\n}\n```"
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_inpu\: {\n    \"selectorI\: 54,\n    \"saveOn\": \"leads\",\n    \"propertie\: [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_inpu\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
      },
      observation: "Successfully scrolled 1600px vertically."
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          selectorId: 71,
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n    \"selectorI\: 71\n  }\n}\n```"
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_inpu\: {\n    \"selectorI\: 54,\n    \"saveOn\": \"leads\",\n    \"propertie\: [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_inpu\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
      },
      observation: "Successfully scrolled 1600px vertically."
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          selectorId: 71,
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n    \"selectorI\: 71\n  }\n}\n```"
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Extract Data\",\n  \"action_inpu\: {\n    \"selectorI\: 54,\n    \"saveOn\": \"leads\",\n    \"propertie\: [\n        { \"name\": \"name\", \"selector\": \"a:nth-child(1) > span:nth-child(1) > span:nth-child(1)\" },\n        { \"name\": \"profission\", \"selector\": \".entity-result__primary-subtitle\" },\n        { \"name\": \"city\", \"selector\": \".entity-result__secondary-subtitle\" },\n        { \"name\": \"current\", \"selector\": \".entity-result__summary\" },\n        { \"name\": \"link\", \"selector\": \".app-aware-link\", \"attribute\": \"href\" }\n    ]\n}\n```",
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
        log: "Action:\n```\n{\n  \"action\": \"Web Browser scroll\",\n  \"action_inpu\: {\n    \"direction\": \"Vertical\",\n \"scrollTo\": \"1600\"\n  }\n}\n```"
      },
      observation: "Successfully scrolled 1600px vertically."
    },
    {
      action: {
        tool: "Web Browser Click",
        toolInput: {
          selectorId: 71,
        },
        log: "Action:\n```\n{\n  \"action\": \"Web Browser Click\",\n  \"action_inpu\: {\n    \"selectorI\: 71\n  }\n}\n```"
      },
      observation: "The element \".artdeco-pagination__button--next\" was clicked"
    },
  ];
}