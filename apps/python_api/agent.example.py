from model import Model
from langchain_experimental.agents.agent_toolkits import create_python_agent
from langchain.agents.agent_types import AgentType

class Agent:
    def __init__(self, tool) -> None:
        self.model = Model.initialize_model()
        self.tool = tool
        self._agent_executor = self.agent_executor()

    def agent_executor(self):
        return create_python_agent(
            llm=self.model,
            tool=self.tool,
            verbose=True,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            agent_executor_kwargs={"handle_parsing_errors": True},
        )
