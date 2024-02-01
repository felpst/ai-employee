import 'dotenv/config';
import { BrowserAgent } from "../lib/browser";
import { Skill } from "../lib/browser.interfaces";
import { IAIEmployee } from '@cognum/interfaces';

describe('AI Agent Browser', () => {
    jest.setTimeout(600000);

    const skills: Skill[] = [
        {
            "name": "Login on Trello",
            "description": "Use this to login on Trello.",
            "inputs": {
                "email": {
                    "type": "string",
                    "description": "Email on Trello account."
                },
                "password": {
                    "type": "string",
                    "description": "Password on Trello account."
                }
            },
            "steps": [
                { "method": "loadUrl", "params": { "url": "https://trello.com/login" } },
                { "method": "inputText", "params": { "selector": "#user", "content": "{email}" } },
                { "method": "click", "params": { "selector": "#login", "sleep": 5000 } },
                {
                    "method": "if", "params": {
                        "condition": "!browserMemory.currentUrl.includes('https://trello.com/')", "steps": [
                            { "method": "inputText", "params": { "selector": "#password", "content": "{password}" } },
                            { "method": "click", "params": { "selector": "#login-submit" } },
                        ]
                    }
                },
            ],
            "successMessage": "Trello Login successful!"
        },
        {
            "name": "Access Board on trello",
            "description": "Use this to access board on Trello ",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of board"
                },
            },
            "steps": [
                {
                    "method": "if", "params": {
                        "condition": "!browserMemory.currentUrl.includes('https://trello.com/u/')", "steps": [
                            { "method": "loadUrl", "params": { "url": "https://trello.com/u/boards" } },
                        ]
                    }
                },
                { "method": "loadUrl", "params": { "url": "https://trello.com/" } },
                { "method": "clickByText", "params": { "text": "{query}", "tagName": "div", "sleep": 5000 } },
            ],
        },
        {
            "name": "List All Boards on trello",
            "description": "Use this to list boards on Trello ",
            "inputs": {},
            "steps": [
                {
                    "method": "if", "params": {
                        "condition": "!browserMemory.currentUrl.includes('https://trello.com/u/')", "steps": [
                            { "method": "loadUrl", "params": { "url": "https://trello.com/u/boards" } },
                        ]
                    }
                },
                { "method": "loadUrl", "params": { "url": "https://trello.com/" } },
                {
                    "method": "dataExtraction", "params": {
                        "container": "#content > div > div.js-boards-page > div > div > div > div > div > div > div > div:nth-child(4) > div > div:nth-child(2) > ul", "saveOn": "boards", "properties": [
                            { "name": 'boardName', "selector": 'div.board-tile-details-name' },

                        ]
                    }
                },
                { "method": "saveOnFile", "params": { "fileName": "boards", "memoryKey": "boards" } }

            ],
        },
        {
            "name": "List all lists and cards on Trello board",
            "description": "Use this only after you have used list all lists on Trello",
            "inputs": {
                "class": {
                    "type": "string",
                    "description": "class of list."
                },
            },
            "steps": [
                {
                    "method": "dataExtraction", "params": {
                        "container": '#board', "saveOn": "lists-cards", "properties": [
                            { "name": 'id', "attribute": 'data-list-id' },
                            { "name": 'class', "attribute": 'class' },
                            { "name": 'name', "selector": '[data-testid="list-name"]' },
                            { "name": 'cardsNames', "selector": '[data-testid="card-name"]', 'type': 'array' },
                        ]
                    }
                },
                { "method": "saveOnFile", "params": { "fileName": "trello-list-cards", "memoryKey": "lists-cards" } }

            ],
        },
        {
            "name": "Delete a card in trello",
            "description": "Use this to delete a card in trello",
            "inputs": {
                "cardName": {
                    "type": "string",
                    "description": "You will have a array of cards, you need find the card name and put here"
                }
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{cardName}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-archive-card", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-delete-card", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-confirm", "sleep": 5000 } },

            ],
        },
        {
            "name": "Adding member to a card in trello",
            "description": "Use this add new member at a card in trello",
            "inputs": {
                "cardName": {
                    "type": "string",
                    "description": "You will have a array of cards, you need find the card name and put here"
                },
                "name": {
                    "type": "string",
                    "description": "Name of member"
                },
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{cardName}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-change-card-members", "sleep": 5000 } },
                { "method": "click", "params": { "selector": "[alt*='{name}']", "sleep": 5000 } },

            ],
        },
        {
            "name": "Remove member from card in trello",
            "description": "Use this remove member at a card in trello",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of card"
                },
                "name": {
                    "type": "string",
                    "description": "Name of member"
                },
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{query}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": "[alt*='{name}']", "sleep": 5000 } },
                { "method": "click", "params": { "selector": '[data-testid="remove-from-card"]', "sleep": 5000 } },

            ],
        },
        {
            "name": "add new tag on card in trello",
            "description": "Use this add new tag at a card in trello",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of card"
                },
                "tagName": {
                    "type": "string",
                    "description": "Name of tag"
                }
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{query}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-edit-labels", "sleep": 5000 } },
                { "method": "clickByText", "params": { "text": "{tagName}", "sleep": 5000 } },

            ],
        },
        {
            "name": "Remove tag on card in trello",
            "description": "Use this to remove tag at a card in trello",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of card"
                },
                "tagName": {
                    "type": "string",
                    "description": "Name of tag"
                }
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{query}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-edit-labels", "sleep": 5000 } },
                { "method": "clickByText", "params": { "text": "{tagName}", "sleep": 5000 } },

            ],
        },
        {
            "name": "Move Card for other column in trello",
            "description": "Use this to move a card in trello",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of card"
                },
                "list": {
                    "type": "string",
                    "description": "Name of board to move card"
                },
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{query}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-move-card", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-select-list", "sleep": 5000 } },
                { "method": "clickByText", "params": { "text": "{list}", "tagName": "option", "sleep": 5000 } },
                { "method": "click", "params": { "selector": '[data-testid="move-card-popover-move-button"]', "sleep": 5000 } },
            ],
        },
        {
            "name": "Move Card for other column in trello",
            "description": "Use this to move a card in trello",
            "inputs": {
                "query": {
                    "type": "string",
                    "description": "Name of card"
                },
                "list": {
                    "type": "string",
                    "description": "Name of board to move card"
                },
            },
            "steps": [
                { "method": "clickByText", "params": { "text": "{query}", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-move-card", "sleep": 5000 } },
                { "method": "click", "params": { "selector": ".js-select-list", "sleep": 5000 } },
                { "method": "clickByText", "params": { "text": "{list}", "tagName": "option", "sleep": 5000 } },
                { "method": "click", "params": { "selector": '[data-testid="move-card-popover-move-button"]', "sleep": 5000 } },
            ],
        },
        {
            "name": "Create new card in Trello",
            "description": "Use this to create a new card in Trello",
            "inputs": {
                "listId": {
                    "type": "string",
                    "description": "List id to create card."
                },
                "name": {
                    "type": "string",
                    "description": "Name of new card."
                },
            },
            "steps": [
                { "method": "click", "params": { "selector": '[data-list-id="{listId}"] button[data-testid="list-add-card-button"]', "sleep": 5000 } },
                { "method": "inputText", "params": { "selector": '[data-testid="list-card-composer-textarea"]', "content": "{name}" } },
                { "method": "click", "params": { "selector": '[data-testid="list-card-composer-add-card-button"]', "sleep": 5000 } },

            ],
        },
    ];
    const email = process.env.TRELLO_USERNAME;
    const password = process.env.TRELLO_PASSWORD;

    // TODO: switch to personal email for testing
    const memory = `
    Trello:
    - Email: ${email}
    - Password: ${password}`;

    const browserAgent = new BrowserAgent(skills, memory, { _id: 'testaiemployee' } as IAIEmployee);

    beforeAll(async () => {
        await browserAgent.seed();
    });

    test('Trello login', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Login on Trello'
        });
        console.log(JSON.stringify(result));
    });

    test('Trello click on board', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board'
        });
        console.log(JSON.stringify(result));
    });

    test('Trello list all boards', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'List All boards'
        });
        console.log(JSON.stringify(result));
    });

    test('Trello list all lists and cards', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board list all lists and cards'
        });
        console.log(JSON.stringify(result));
    });

    test('Trello delete card', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: "Go to Product Roadmap board and delete teste renato card"
        });
        console.log(JSON.stringify(result));
    });
    test('Trello add member to card', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board and to Teste Renato card and add Linecker member'
        });
        console.log(JSON.stringify(result));
    });
    test('Trello remove member from card', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board and to Teste Renato card and remove Renato member'
        });
        console.log(JSON.stringify(result));
    });
    test('Trello add new tag', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board and to Teste Renato card and add new tag Bugs'
        });
        console.log(JSON.stringify(result));
    });
    test('Trello remove tag', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: "Go to Product Roadmap board and to 'teste renato' card and remove tag Bugs"
        });
        console.log(JSON.stringify(result));
    });
    test('Trello move card', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board and to Teste Renato card and move it to Developing list'
        });
        console.log(JSON.stringify(result));
    });
    test('Trello create a card', async () => {
        const result = await browserAgent.executorAgent.invoke({
            input: 'Go to Product Roadmap board and create a "Test Create Card" card in Backlog list'
        });
        console.log(JSON.stringify(result));
    });
});
