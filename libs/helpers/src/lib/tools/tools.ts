const tools = [
  {
    "id": "calculator",
    "name": "Calculator",
    "description": "Performing precise mathematical calculations",
    "icon": "https://storage.googleapis.com/factory-assets/tools/calculator-tool.png",
    intentions: ['Task Execution'],
    show: false
  },
  {
    "id": "random-number",
    "name": "Random Number",
    "description": "Generate random numbers",
    "icon": "https://storage.googleapis.com/factory-assets/tools/calculator-tool.png",
    intentions: ['Task Execution'],
    show: false
  },
  {
    "id": "google-search",
    "name": "Google Search",
    "description": "Retrieve information by Google search",
    "icon": "https://storage.googleapis.com/factory-assets/tools/web-search-tool.png",
    intentions: ['Information Retrieval'],
    show: false
  },
  {
    "id": "web-browser",
    "name": "Web Browser",
    "description": "Extract information from web pages",
    "icon": "https://storage.googleapis.com/factory-assets/tools/web-search-tool.png",
    intentions: ['Information Retrieval'],
    show: false
  },
  {
    "id": "mail",
    "name": "Email",
    "description": "Send and read emails",
    "icon": "https://storage.googleapis.com/factory-assets/tools/email-tool.png",
    "intentions": ['Task Execution'],
    "show": true,
    "subTools": [
      {
        "id": "mail-sender",
        "name": "Send Email",
        "description": "Send emails"
      },
      {
        "id": "mail-reader",
        "name": "Read Email",
        "description": "Read emails"
      }
    ]
  },
  {
    "id": "python",
    "name": "Python",
    "description": "Generating and execute Python Code to solve complex problems",
    "icon": "https://storage.googleapis.com/factory-assets/tools/code-tool.png",
    intentions: ['Task Execution'],
    show: false
  },
  {
    "id": "sql-connector",
    "name": "SQL Connector",
    "description": "Get information from SQL database",
    "icon": "https://storage.googleapis.com/factory-assets/tools/database-tool.png",
    intentions: ['Information Retrieval'],
    show: true
  },
  {
    "id": "linkedin",
    "name": "LinkedIn Tools",
    "description": "Find leads on LinkedIn",
    "icon": "https://storage.googleapis.com/factory-assets/tools/linkedin-lead-scraper-tool.png",
    intentions: ['Task Execution'],
    show: true
  },
  {
    "id": "google-calendar",
    "name": "Google Calendar",
    "description": "Manage your Google Calendar",
    "icon": "https://storage.googleapis.com/factory-assets/tools/google-calendar.png",
    scope: 'https://www.googleapis.com/auth/calendar',
    intentions: ['Task Execution'],
    show: true
  },
  {
    "id": "knowledge-retriever",
    "name": "Knowledge Retrieve",
    "description": "Storing information in the knowledge base, carrying out research on it and building knowledge from it",
    "icon": "https://storage.googleapis.com/factory-assets/tools/knowledge-tool.png",
    intentions: ['Information Retrieval'],
    show: false
  },
]
export default tools;
