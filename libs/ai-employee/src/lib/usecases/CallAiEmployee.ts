import { Callbacks } from 'langchain/dist/callbacks';
import { AiEmployee } from "../entities/AiEmployee";

export class CallAiEmployee {
  private aiEmployee: AiEmployee;

constructor(aiEmployee: AiEmployee) {
  this.aiEmployee = aiEmployee;
}

async execute(input: string, callbacks?: Callbacks | any) {

  const message = await this.aiEmployee.memory.addMessage({
    content: input,
    role: 'HUMAN',
  });
  console.log('message', message);


  if (callbacks.onSaveHumanMessage) {
    callbacks.onSaveHumanMessage(message);
  }

  // Executor
  const chainValues = await this.aiEmployee._executor.call({ input }, callbacks);
  const response = chainValues.output;

  // Save response
  await this.aiEmployee.memory
    .addMessage({ content: response, role: 'AI', question: message._id })
    .then((responseMessage) => {
      if (callbacks.onSaveAIMessage) {
        callbacks.onSaveAIMessage(responseMessage);
      }

      // Generate chat name
      if (
        this.aiEmployee.memory.chat.name === 'New chat' &&
        this.aiEmployee.memory.messages.length >= 2
      ) {
        this.aiEmployee.memory.chatName(callbacks);
      }
    });

  return response;
}
}