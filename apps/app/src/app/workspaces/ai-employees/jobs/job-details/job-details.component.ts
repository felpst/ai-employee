import { Component } from '@angular/core';
import { AuthService } from 'apps/app/src/app/auth/auth.service';
import { Step } from 'apps/app/src/app/shared/stepper/stepper.component';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'cognum-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  navs: Step[] = [
    { title: 'Overview', routerLink: 'overview' },
    { title: 'History', routerLink: 'history' },
    { title: 'Settings', routerLink: 'settings' }
  ]

  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  selectedImage: string | null = null;

  constructor(
    private authService: AuthService,
    private jobsService: JobsService,
  ) {
  }

  get user() {
    return this.authService.user
  }

  get job() {
    return this.jobsService.job
  }

}
