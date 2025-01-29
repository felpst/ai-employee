import { Component } from '@angular/core';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { JobsService } from '../../jobs.service';

@Component({
  selector: 'cognum-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss'],
})
export class JobOverviewComponent {
  loading = false;

  constructor(
    private jobsService: JobsService,
    private notificationsService: NotificationsService,
  ) { }

  get job() {
    return this.jobsService.job;
  }

  onExecute() {
    console.log('onExecute');
    this.loading = true;
    this.jobsService.execute(this.job, true).subscribe({
      next: (response) => {
        console.log(response);
        this.notificationsService.show('Job executed successfully: ' + response.result.output)
      },
      error: (error) => {
        console.error(error);
        this.notificationsService.show('Error executing job: ' + error.error.message)
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }


}
