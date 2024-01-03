import { AIEmployeeRepository, AIEmployeeTools } from '@cognum/ai-employee';
import { RepositoryHelper } from '@cognum/helpers';
import { IAIEmployee, IAIEmployeeCall, IWorkspace } from '@cognum/interfaces';
import { Job, User } from '@cognum/models';
import { MailService } from '@cognum/tools';
import { NextFunction, Request, Response } from 'express';
import ModelController from '../../controllers/model.controller';

export class MailController extends ModelController<typeof Job> {
  constructor() {
    super(Job);
  }

  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const aiEmployees = new Map<string, IAIEmployee>()

      // Find unseen emails
      const mailService = new MailService(AIEmployeeTools.MailToolkitSettings())
      const mails = await mailService.find({
        status: 'UNSEEN',
      })
      // console.log(mails);

      for (const mail of mails) {
        // Get AI Employee
        const aiEmployeeId = mail.to.split('@')[0]?.split('+')[1] || undefined
        if (!aiEmployeeId) continue;

        let aiEmployee: IAIEmployee;
        if (!aiEmployees.has(aiEmployeeId)) {
          // console.log(aiEmployeeId);
          try {
            aiEmployee = await new AIEmployeeRepository().getById(aiEmployeeId, { populate: [{ path: 'workspace' }] })
          } catch (error) { continue; }
          aiEmployees.set(aiEmployeeId, aiEmployee)
        } else {
          aiEmployee = aiEmployees.get(aiEmployeeId)
        }
        if (!aiEmployee) continue;
        // console.log(aiEmployee);

        // Loading related messages
        let relatedMessages = [];
        if (mail.references) {
          relatedMessages = await mailService.find({ references: mail.references });
        }
        // Get user
        const emailFrom = mail.from.includes('<') ? mail.from.split('<')[1]?.split('>')[0] : mail.from
        // console.log(emailFrom);

        const user = (await new RepositoryHelper(User).find({ filter: { email: emailFrom } }))[0]
        // console.log(user);
        if (!user) continue;

        // Check user has access ai employee workspace
        if ((aiEmployee.workspace as IWorkspace).users.find(u => u.user.toString() === user._id.toString()) === undefined) continue;

        // Execute call
        const call = await aiEmployee.call({
          input: mail.text,
          user,
          context: {
            chatMessages: relatedMessages && relatedMessages.length > 0 ? relatedMessages : [],
          },
        })
        call.context.chatChannel = 'email';
        const callResult: IAIEmployeeCall = await new Promise((resolve, reject) => {
          try {
            call.run().subscribe(call => {
              if (call.status === 'done') { resolve(call); }
            })
          } catch (error) {
            reject(error);
          }
        });

        // Answer email
        await mailService.sendMarkdown({
          from: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          replyTo: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          inReplyTo: mail.id,
          to: mail.from,
          subject: 'Re: ' + mail.subject,
          html: callResult.output,
        })
        console.log('Email sent: ', callResult.output,);

        // Marcar email como lido
        // console.log('Marking email as read');
        await mailService.markAsRead(mail.uid);
      }

      return res.status(200).json({ message: 'Emails are checked' });
    } catch (error) {
      console.error(`Check emails error: ${error.message}`);
      return res.status(200).json({ message: 'Emails are checked' });
    }
  }
}

export default new MailController();
