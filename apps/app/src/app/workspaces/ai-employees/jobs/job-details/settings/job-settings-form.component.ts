import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IJob } from '@cognum/interfaces';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { AIEmployeesService } from '../../../ai-employees.service';
import { JobsService } from '../../jobs.service';

@Component({
  selector: 'cognum-job-settings-form',
  templateUrl: './job-settings-form.component.html',
  styleUrls: ['./job-settings-form.component.scss'],
})
export class JobSettingsFormComponent {
  form!: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private jobsService: JobsService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private employeesService: AIEmployeesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: [this.job.name || '', [Validators.required]],
      description: [this.job.description || '', [Validators.required]],
      instructions: [this.job.instructions || '', Validators.required],
      status: [this.job.status || 'running', [Validators.required]],
      scheduler: this.formBuilder.group({
        frequency: [this.job?.scheduler?.frequency || ''],
      }),
    });
  }

  async onSave() {
    this.isLoading = true;
    const job: Partial<IJob> = this.form.value
    job.aiEmployee = this.aiEmployee._id
    return this.jobsService.update({ _id: this.job._id, ...job }).subscribe({
      next: (res) => this.handleSuccess('Successfully updated job', res),
      error: (error) => this.handleError('Error updating job. Please try again.', error)
    });
  }

  handleSuccess(message: string, updated: IJob) {
    this.jobsService.job = updated
    this.notificationsService.show(message);
    this.isLoading = false;
  }

  handleError(message: string, error: any) {
    console.error(message, error);
    this.notificationsService.show(message);
    this.isLoading = false;
  }

  onRemove() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Job',
        content: 'Are you sure you want to delete this job?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.job) {
        this.jobsService.delete(this.job).subscribe({
          next: (res) => {
            this.notificationsService.show('Successfully deleted job');
            this.router.navigate(['../../'], { relativeTo: this.route })
          },
          error: (error) => {
            console.error('Error deleting job. Please try again.', error);
            this.notificationsService.show('Error deleting job. Please try again.');
          },
        });
      }
    });
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.form.get(inputName)?.invalid &&
      this.form.get(inputName)?.touched &&
      this.form.get(inputName)?.hasError(errorName)
    );
  }

  get job() {
    return this.jobsService.job
  }

  get aiEmployee() {
    return this.employeesService.aiEmployee
  }
}
