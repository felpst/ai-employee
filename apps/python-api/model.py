import os
from dotenv import load_dotenv
from langchain.chat_models import AzureChatOpenAI


dotenv_path = "./.env"

load_dotenv(dotenv_path)


class Model:
    @classmethod
    def initialize_model(self):
        return AzureChatOpenAI(
            deployment_name="gpt-4",
            openai_api_type="azure",
            openai_api_version="2023-05-15",
            openai_api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            openai_api_base=os.getenv("AZURE_API_BASE"),
        )
