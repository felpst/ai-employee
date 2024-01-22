import os
import tempfile
import requests
from langchain_experimental.tools import PythonREPLTool
from langchain_experimental.agents.agent_toolkits import create_python_agent
from langchain.agents.agent_types import AgentType
from model.azure_model import Model

class PythonTool:
    def __init__(self, instructions="", file_urls=[]):
        self.model = Model.initialize_model()
        self._downloaded_files = []
        self._prefix=""
        
        self._temp_dir = tempfile.mkdtemp()
        self.prepare_instructions(instructions, file_urls)
        self._agent_executor = self.agent_executor()

    def agent_executor(self):
        return create_python_agent(
            llm=self.model,
            tool=PythonREPLTool(),
            verbose=True,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            agent_executor_kwargs={"handle_parsing_errors": True},
            prefix=self._prefix
        )

    def prepare_instructions(self, instructions, file_urls):
        for url in file_urls:
            self.download_file(url)

        if (instructions):
            self._prefix = instructions
            
        if len(self._downloaded_files) > 0:
            files_string = ", ".join(self._downloaded_files)
            suffix = f"You have access to the files: {files_string}."
            self._prefix = f"{self._prefix} {suffix}"

    def download_file(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            file_name = os.path.join(self._temp_dir, os.path.basename(url))
            with open(file_name, 'wb') as f:
                f.write(response.content)
            self._downloaded_files.append(file_name)

    def run(self, string):
        try:
            result = self._agent_executor.run(string)
        finally:
            self.cleanup_files()
        return result

    def cleanup_files(self):
        for file_path in self._downloaded_files:
            try: 
                os.remove(file_path)
            finally:
                self._downloaded_files.remove(file_path)