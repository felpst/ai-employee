import { ChatModel } from '@cognum/llm';
import {
  initializeAgentExecutorWithOptions
} from 'langchain/agents';
import { MailSenderSettings } from './mail-sender.interfaces';
import { MailSenderTool } from './mail-sender.tool';

  
  describe('SendEmail tool test', () => {
  const settings: MailSenderSettings = {
       service : "gmail",
     user :  "ta.funcionando15@gmail.com",
     password : "ibzu qzah ihzz sdcg",
    }

      const tools = [
          new MailSenderTool(settings),
        ];
      const model = new ChatModel();
  
  
    it('should send email successfully', async () => {
    
      const executor = await initializeAgentExecutorWithOptions(
          tools,
          model,
          {
            agentType: 'structured-chat-zero-shot-react-description',
            verbose: false,
          }
        );
        const result = await executor.call({ input: 'send email to devrenatorodrigues@gmail.com with the subject TEST with a joke ' });
        expect(result.output).toContain('Email sent successfully');
      })
  });