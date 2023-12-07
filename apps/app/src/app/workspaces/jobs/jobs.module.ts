import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobsComponent } from './jobs.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { SharedModule } from '../../shared/shared.module';
import { JobActionsComponent } from './job-actions/job-actions.component';
import { JobFormComponent } from './job-form/job-form.component';
import { JobModalComponent } from './job-modal/job-modal.component';
import { JobsRoutingModule } from './jobs-routing.module';

@NgModule({
  declarations: [
    JobsComponent,
    JobFormComponent,
    JobModalComponent,
    JobActionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MarkdownModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    LMarkdownEditorModule,
    SharedModule,
    JobsRoutingModule
  ],
})
export class JobsModule { }
