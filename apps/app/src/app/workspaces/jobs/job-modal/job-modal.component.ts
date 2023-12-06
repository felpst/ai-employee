/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { IJob } from '@cognum/interfaces';
import { AIEmployeesService } from '../../ai-employees/ai-employees.service';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'cognum-job-modal',
  templateUrl: './job-modal.component.html',
  styleUrls: ['./job-modal.component.scss'],
})
export class JobModalComponent {
  job: IJob;

  constructor(
    private dialogRef: MatDialogRef<JobModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IJob,
    private jobsService: JobsService,
    private employeesService: AIEmployeesService
  ) {
    this.job = data;
  }

  loadJob() {
    return this.jobsService.load(this.employee);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  updatedTimeDifference(updatedAt: Date | undefined): string {
    if (!updatedAt) {
      return 'N/A';
    }

    const diffMilliseconds = new Date().getTime() - new Date(updatedAt).getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  handleKnowledgeEdited() {
    this.loadJob();
    this.closeModal();
  }

  handleKnowledgeDeleted() {
    this.loadJob();
    this.closeModal();
  }

  capitalizeName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }
}
