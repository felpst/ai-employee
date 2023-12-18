/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IJob, IUser } from '@cognum/interfaces';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { AIEmployeesService } from '../../ai-employees.service';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'cognum-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent {
  members: IUser[] = [];
  fileName: string | undefined;
  form!: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };
  isLoading = false;
  creatorId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private jobsService: JobsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JobFormComponent>,
    private notificationsService: NotificationsService,
    private employeesService: AIEmployeesService,
    @Inject(MAT_DIALOG_DATA) private data: { job: IJob; }
  ) {
    this.form = this.formBuilder.group({
      name: [data.job?.name || '', [Validators.required]],
      status: [data.job?.status || 'running', [Validators.required]],
      instructions: [data.job?.instructions || '', Validators.required],
      scheduler: this.formBuilder.group({
        frequency: [data.job?.scheduler?.frequency || '', Validators.required],
      }),
    });
  }

  get job() {
    return this.data.job;
  }

  async onSave() {
    this.isLoading = true;
    const job: Partial<IJob> = this.form.value
    job.aiEmployee = this.aiEmployee._id

    if (this.data.job) {
      return this.jobsService.update(job).subscribe({
        next: (res) => this.handleSuccess('Successfully updated job', res),
        error: (error) => this.handleError('Error updating job. Please try again.', error),
      });
    } else return this.jobsService.create(job).subscribe({
      next: (res) => this.handleSuccess('Successfully created job', res),
      error: (error) => this.handleError('Error creating job. Please try again.', error)
    });
  }

  handleSuccess(message: string, res: any) {
    this.notificationsService.show(message);
    this.dialogRef.close(res);
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
        title: 'Delete Knowledge',
        content: 'Are you sure you want to delete this job?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.data.job) {
        this.jobsService.delete(this.data.job).subscribe({
          next: (res) => {
            this.notificationsService.show('Successfully deleted job');
            this.dialogRef.close(res);
          },
          error: (error) => {
            console.error('Error deleting job. Please try again.', error);
            this.notificationsService.show('Error deleting job. Please try again.');
          },
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.form.get(inputName)?.invalid &&
      this.form.get(inputName)?.touched &&
      this.form.get(inputName)?.hasError(errorName)
    );
  }

  get aiEmployee() {
    return this.employeesService.aiEmployee
  }
}
