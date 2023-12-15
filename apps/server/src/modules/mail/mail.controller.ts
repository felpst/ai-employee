import { AIEmployeeRepository, AIEmployeeTools, GeneralAgent, INTENTIONS } from '@cognum/ai-employee';
import { IAIEmployee } from '@cognum/interfaces';
import { Job } from '@cognum/models';
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
      const mailService = new MailService(AIEmployeeTools.MailToolkitSettings)
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
          aiEmployee = await new AIEmployeeRepository().getById(aiEmployeeId)
          aiEmployees.set(aiEmployeeId, aiEmployee)
        } else {
          aiEmployee = aiEmployees.get(aiEmployeeId)
        }
        if (!aiEmployee) continue;

        // Create agent
        const agent = await new GeneralAgent(aiEmployee).init();

        // Execute call
        const res = await agent.call(mail.text, [INTENTIONS.TASK_EXECUTION, INTENTIONS.INFORMATION_RETRIEVAL])
        console.log(res);

        // Answer email
        await mailService.send({
          from: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          replyTo: `${aiEmployee.name} - Cognum AI Employee <${aiEmployee.getEmail()}>`,
          to: mail.from,
          subject: 'Re: ' + mail.subject,
          text: res.output,
        })
        console.log('Email sent');

        // Marcar email como lido
        // console.log('Marking email as read');
        await mailService.markAsRead(mail.uid);
      }

      return res.status(200).json({ message: 'Emails are checked' });
    } catch (error) {
      if (error.message === 'Nothing to fetch') {
        return res.status(200).json({ message: 'Emails are checked' });
      }
      console.error(error);
      next(error)
    }
  }
}

export default new MailController();
