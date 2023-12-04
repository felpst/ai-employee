import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KnowledgeBaseComponent } from './knowledge-base.component';

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
import { KnowledgeActionsComponent } from './knowledge-actions/knowledge-actions.component';
import { KnowledgeChooseFormDialogComponent } from './knowledge-choose-form-dialog/knowledge-choose-form-dialog.component';
import { KnowledgeFormComponent } from './knowledge-form/knowledge-form.component';
import { KnowledgeModalComponent } from './knowledge-modal/knowledge-modal.component';

@NgModule({
  declarations: [
    KnowledgeBaseComponent,
    KnowledgeFormComponent,
    KnowledgeModalComponent,
    KnowledgeActionsComponent,
    KnowledgeChooseFormDialogComponent
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
  ],
})
export class KnowledgeBaseModule { }
