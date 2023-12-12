import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IJob } from '@cognum/interfaces';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { inListValidator } from 'apps/app/src/app/shared/validations';
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
  statusOptions = [
    { value: 'running', label: 'Run' },
    { value: 'stopped', label: 'Stop' },
  ]

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
      name: ['', [Validators.required]],
      instructions: ['', Validators.required],
      frequency: ['', Validators.required],
      status: ['Running', [Validators.required, inListValidator(this.statusOptions.map(({ value }) => value))]],
    });

    this.initializeForm();
  }

  initializeForm(): void {
    const { name, instructions, frequency, status } = this.job
    this.form.get('name')?.patchValue(name);
    this.form.get('instructions')?.patchValue(instructions);
    this.form.get('frequency')?.patchValue(frequency);
    this.form.get('status')?.patchValue(status);
  }

  async onSave() {
    this.isLoading = true;
    const { status, ...rest } = this.form.value
    const _status = status.toLowerCase();
    const data = { ...this.job, ...rest, status: _status, aiEmployee: this.aiEmployee._id }
    return this.jobsService.update(data).subscribe({
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
