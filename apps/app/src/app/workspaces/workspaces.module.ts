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
import { CreateWorkspaceFormComponent } from './create-workspace-form/create-workspace-form.component';
import { SettingsWorkspaceComponent } from './settings-workspace/settings-workspace.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ChatsRoutingModule } from './workspaces-routing.module';
import { WorkspacesComponent } from './workspaces.component';

@NgModule({
  declarations: [
    WorkspacesComponent,
    CreateWorkspaceFormComponent,
    WorkspaceComponent,
    SettingsWorkspaceComponent,
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
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
  ],
})
export class WorkspacesModule {}
