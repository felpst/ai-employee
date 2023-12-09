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
import { inListValidator } from 'apps/app/src/app/shared/validations';
import { AIEmployeesService } from '../../ai-employees.service';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'cognum-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent {
  job: IJob | undefined;
  members: IUser[] = [];
  fileName: string | undefined;
  form!: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };
  isLoading = false;
  creatorId: string | undefined;
  statuses = ['Running', 'Done']

  constructor(
    private formBuilder: FormBuilder,
    private jobsService: JobsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JobFormComponent>,
    private notificationsService: NotificationsService,
    private employeesService: AIEmployeesService,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      job: IJob;
    }
  ) {
    this.job = this.data.job;
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      instructions: ['', Validators.required],
      frequency: ['', Validators.required],
      status: ['Running', [Validators.required, inListValidator(this.statuses)]]
    });

    this.initializeForm();
  }

  initializeForm(): void {
    const { job } = this.data
    if (job) {
      const { name, instructions, frequency, status } = job
      this.form.get('name')?.patchValue(name);
      this.form.get('instructions')?.patchValue(instructions);
      this.form.get('frequency')?.patchValue(frequency);
      this.form.get('status')?.patchValue(status);
    }
  }

  async onSave() {
    this.isLoading = true;
    const { status, ...rest } = this.form.value
    const _status = status.toLowerCase();
    const data = { ...this.job, ...rest, status: _status, aiEmployee: this.aiEmployee._id }
    if (this.job) {
      return this.jobsService.update(data).subscribe({
        next: (res) => this.handleSuccess('Successfully updated job', res),
        error: (error) => this.handleError('Error updating job. Please try again.', error)
      });
    }
    else return this.jobsService.create(data).subscribe({
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
      if (result && this.job) {
        this.jobsService.delete(this.job).subscribe({
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
