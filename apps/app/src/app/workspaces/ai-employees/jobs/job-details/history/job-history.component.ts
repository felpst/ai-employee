import { Component } from '@angular/core';
import { IUser } from '@cognum/interfaces';

export type UserType = { user: IUser, permission: 'Admin' | 'Employee' }

@Component({
  selector: 'cognum-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss'],
})
export class JobHistoryComponent {

}
