
import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class PythonTool extends DynamicTool {
  constructor() {
    super({
      name: 'Python',
      description:
        'Use to create python and automation code or create scripts. Input should be a task instruction to executor.',
      func: async (input: string) => {
        console.log('------------PythonTool------------');

        // TODO: Define pythonTool url 
        const result = await axios.post(process.env.PYTHON_TOOL_URL, { input });
        console.log(`Got output ${result.data}`);
        console.log('------------PythonTool------------');
        return result.data;
      },
    });
  }
}
