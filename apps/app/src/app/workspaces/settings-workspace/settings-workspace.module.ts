import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SettingsWorkspaceComponent } from './settings-workspace.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';

import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
  declarations: [SettingsWorkspaceComponent],
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
  ],
})
export class SettingsWorkspaceModule {}
