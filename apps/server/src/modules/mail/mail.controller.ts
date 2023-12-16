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
      // Find unseen emails
      const mailService = new MailService(AIEmployeeTools.MailToolkitSettings())
      const mails = await mailService.find({
        status: 'UNSEEN',
      })
      console.log(mails);

      const aiEmployees = new Map<string, IAIEmployee>()

      for (const mail of mails) {
        // Get AI Employee
        const aiEmployeeId = mail.to.split('@')[0]?.split('+')[1] || undefined
        if (!aiEmployeeId) continue;

        let aiEmployee: IAIEmployee;
        if (!aiEmployees.has(aiEmployeeId)) {
          console.log(aiEmployeeId);
          try {
            aiEmployee = await new AIEmployeeRepository().getById(aiEmployeeId, { populate: [{ path: 'workspace' }] })
          } catch (error) { continue; }
          aiEmployees.set(aiEmployeeId, aiEmployee)
        } else {
          aiEmployee = aiEmployees.get(aiEmployeeId)
        }
        if (!aiEmployee) continue;

        // Get user
        const user = (await new RepositoryHelper(User).find({ filter: { email: mail.from } }))[0]
        if (!user) continue;

        // Check user has access ai employee workspace
        if ((aiEmployee.workspace as IWorkspace).users.find(u => u.user === user._id) === undefined) continue;

        // Execute call
        const call = await aiEmployee.call({
          input: mail.text,
          user: user
        })
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
        await mailService.send({
          from: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          replyTo: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          to: mail.from,
          subject: 'Re: ' + mail.subject,
          html: callResult.output,
        })
        console.log('Email sent');

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
