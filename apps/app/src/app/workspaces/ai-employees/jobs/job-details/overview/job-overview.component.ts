import { Component } from '@angular/core';
import { JobsService } from '../../jobs.service';

@Component({
  selector: 'cognum-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss'],
})
export class JobOverviewComponent {

  constructor(private jobsService: JobsService) { }

  get job() {
    return this.jobsService.job;
  }

  onExecute() {
    console.log('onExecute');
    this.jobsService.execute(this.job).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


}
