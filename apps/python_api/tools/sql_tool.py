from ..model.azure_model import Model
from langchain.agents.agent_types import AgentType
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
import os
from dotenv import load_dotenv

dotenv_path = "./.env"

load_dotenv(dotenv_path)


class SqlTool:
    def __init__(self):
        self.model = Model.initialize_model()
        self.db = SQLDatabase.from_uri(os.getenv("DATABASE"))
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.model)
        self._agent_executor = self.agent_executor()

    def agent_executor(self):
        return create_sql_agent(
            llm=self.model,
            toolkit=self.toolkit,
            verbose=True,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        )

    def run(self, string):
        return self._agent_executor.run(string)
