/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';
import { IJob } from '@cognum/interfaces';
import { AIEmployeesService } from '../ai-employees/ai-employees.service';
import { WorkspacesService } from '../workspaces.service';
import { JobFormComponent } from './job-form/job-form.component';
import { JobModalComponent } from './job-modal/job-modal.component';
import { JobsService } from './jobs.service';

@Component({
  selector: 'cognum-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  jobs: IJob[] = [];
  searchText = '';

  sortingType: 'new' | 'old' | 'acess' = 'new';
  sortingDirection: 'asc' | 'desc' = 'desc';
  activeButton = 'new';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private jobsService: JobsService,
    private workspacesService: WorkspacesService,
    private employeesService: AIEmployeesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.jobs = data['0'] as IJob[];
      this.isLoading = false;
    });
  }

  onForm(job?: IJob) {
    const dialogRef = this.dialog.open(JobFormComponent, {
      width: '640px',
      data: { job, workspace: this.workspace },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.jobsService.load(this.employee).subscribe((jobBase) => {
          this.jobs = jobBase;
        });
      }
    });
  }


  onSearch(event: any) {
    const searchText = event.trim().toLowerCase();

    if (!searchText) {
      this.loadKnowledgeBase();
      return;
    }

    this.searchText = searchText;
    this.jobs = this.jobs.filter(job =>
      job.instructions.toLowerCase().includes(searchText)
    );
  }

  clearSearch() {
    this.searchText = '';
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    return this.jobsService.load(this.employee)
  }

  handleKnowledgeEdited() {
    this.loadKnowledgeBase();
  }

  handleKnowledgeDeleted() {
    this.loadKnowledgeBase();
  }

  openKnowledgeModal(job: IJob): void {
    const dialogRef = this.dialog.open(JobModalComponent, {
      width: '60%',
      height: '80%',
      data: job,
    });

    dialogRef.afterClosed().subscribe(() => this.jobsService.load(this.employee).subscribe((jobBase) => {
      this.jobs = jobBase;
    }));
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

  sortKnowledgeBase(sortingCriterion: string) {
    if (sortingCriterion === 'acess') {
      this.jobs.sort(() => Math.random() - 0.5);
      return;
    }

    this.sortingDirection = sortingCriterion === 'old' ? 'asc' : 'desc';

    this.jobs.sort((a: IJob, b: IJob) => {
      if (a.createdAt && b.createdAt) {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        const sortOrder = this.sortingDirection === 'asc' ? 1 : -1;

        return dateA < dateB ? -sortOrder : dateA > dateB ? sortOrder : 0;
      }
      return 0;
    });
  }

  onButtonClick(button: string) {
    this.activeButton = button;
    this.sortKnowledgeBase(button);
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace;
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }

}
