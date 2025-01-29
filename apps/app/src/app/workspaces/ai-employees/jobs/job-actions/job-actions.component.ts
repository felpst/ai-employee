import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IJob } from '@cognum/interfaces';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { WorkspacesService } from '../../../workspaces.service';
import { AIEmployeesService } from '../../ai-employees.service';
import { JobFormComponent } from '../job-form/job-form.component';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'cognum-job-actions',
  templateUrl: './job-actions.component.html',
  styleUrls: ['./job-actions.component.scss']
})
export class JobActionsComponent {
  @Input() job!: IJob;
  @Output() jobUpdated = new EventEmitter<void>();
  @Output() jobDeleted = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private jobsService: JobsService,
    private workspacesService: WorkspacesService,
    private employeesService: AIEmployeesService
  ) { }

  onForm(job?: IJob) {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '640px',
      data: { job, workspace: this.workspace },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.jobsService.load(this.employee);
    });
  }

  editKnowledge(job: IJob) {
    this.onForm(job);
    this.jobUpdated.emit();
  }

  openDeleteConfirmationDialog(job: IJob) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this job?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteKnowledge(job);
      }
    });
  }

  deleteKnowledge(job: IJob) {
    this.jobsService
      .delete(job)
      .subscribe(() => this.jobDeleted.emit());
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }
}
