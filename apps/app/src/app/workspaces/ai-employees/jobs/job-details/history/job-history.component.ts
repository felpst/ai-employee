import { Component } from '@angular/core';
import { IChatMessage, IUser } from '@cognum/interfaces';
import { JobsService } from '../../jobs.service';

export type UserType = { user: IUser, permission: 'Admin' | 'Employee' }

@Component({
  selector: 'cognum-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss'],
})
export class JobHistoryComponent {

  history: Partial<IChatMessage>[] = [];

  constructor(
    private jobsService: JobsService,
  ) {
    this.history = this.jobsService.calls.map((call) => ({
      content: call.output,
      sender: call.aiEmployee,
      role: 'bot',
      createdAt: call.createdAt,
      call
    }) as Partial<IChatMessage>);
    console.log(this.history);
  }

}
