import { ChatModel } from '@cognum/llm';
import {
    initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { SendEmailTool } from '../send-email.tool';
  
  
  describe('SendEmail tool test', () => {
      const tools = [
          new SendEmailTool(),
        ];
      const model = new ChatModel();
  
  
    it('should send email successfully', async () => {
    
      const executor = await initializeAgentExecutorWithOptions(
          tools,
          model,
          {
            agentType: 'structured-chat-zero-shot-react-description',
            verbose: true,
          }
        );
        const result = await executor.call({ input: 'send email to devrenatorodrigues@gmail.com with the subject TEST and the message olá tenha um bom dia' });
        expect(result.output).toEqual('Email sent successfully');
      })
  });