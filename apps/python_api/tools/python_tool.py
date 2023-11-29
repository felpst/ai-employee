from langchain_experimental.tools import PythonREPLTool
from langchain_experimental.agents.agent_toolkits import create_python_agent
from langchain.agents.agent_types import AgentType
from model.azure_model import Model

class PythonTool:
    def __init__(self):
        self.model = Model.initialize_model()
        self._agent_executor = self.agent_executor()

    def agent_executor(self):
        return create_python_agent(
            llm=self.model,
            tool=PythonREPLTool(),
            verbose=True,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            agent_executor_kwargs={"handle_parsing_errors": True},
        )

    def run(self, string):
        return self._agent_executor.run(string)
