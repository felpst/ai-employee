import os
from dotenv import load_dotenv
from langchain.chat_models import AzureChatOpenAI

if os.environ.get("PROD") == "false":
  dotenv_path = "./.env"
  load_dotenv(dotenv_path)

class Model:
    @classmethod
    def initialize_model(self):
        return AzureChatOpenAI(
            azure_deployment="gpt-4",
            openai_api_version="2023-05-15"
        )
