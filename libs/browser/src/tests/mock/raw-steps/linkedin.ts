import { IntermediateSteps } from '.';

export namespace LinkedinSteps {
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