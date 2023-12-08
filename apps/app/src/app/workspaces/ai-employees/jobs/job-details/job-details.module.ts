import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'apps/app/src/app/shared/shared.module';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { JobHistoryComponent } from './history/job-history.component';
import { JobDetailsComponent } from './job-details.component';
import { JobOverviewComponent } from './overview/job-overview.component';
import { JobSettingsFormComponent } from './settings/job-settings-form.component';

@NgModule({
  declarations: [
    JobDetailsComponent,
    JobHistoryComponent,
    JobOverviewComponent,
    JobSettingsFormComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
    LMarkdownEditorModule
  ],
})
export class JobDetailsModule { }
