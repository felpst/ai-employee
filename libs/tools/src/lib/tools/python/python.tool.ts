
import axios from 'axios';
import { DynamicTool } from 'langchain/tools';

export class PythonTool extends DynamicTool {
  constructor() {
    super({
      name: 'Python',
      metadata: {
        id: "python"
      },
      description:
        'Use to create and execute python code to solve problems. Input should be a problem to solve with description.',
      func: async (input: string) => {
        try {
          const { data } = await axios.post(`${process.env.PYTHON_SERVICE_URL}/python`, { input_text: input });
          return data.result;
        } catch (error) {
          console.log(error);
          return error.message;
        }
      },
    });
  }
}
