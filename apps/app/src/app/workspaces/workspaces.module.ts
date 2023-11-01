import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LayoutsModule } from '../layouts/layouts.module';
import { AiEmployeeModule } from './ai-employee/ai-employee.module';
import { ChatsModule } from './chats/chats.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesRoutingModule } from './workspaces-routing.module';

@NgModule({
  declarations: [WorkspaceComponent],
  imports: [
    CommonModule,
    WorkspacesRoutingModule,
    FormsModule,
    MarkdownModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    LayoutsModule,
    KnowledgeBaseModule,
    ChatsModule,
    AiEmployeeModule
  ],
})
export class WorkspacesModule {}
