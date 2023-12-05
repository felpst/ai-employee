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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceHistoryComponent } from './history/workspace-history.component';
import { JobsModule } from './jobs/jobs.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { SettingsWorkspaceModule } from './settings-workspace/settings-workspace.module';
import { WorkspaceOnboardingAIEmployeeComponent } from './workspace-onboarding/workspace-onboarding-ai-employee/workspace-onboarding-ai-employee.component';
import { WorkspaceOnboardingWorkspaceComponent } from './workspace-onboarding/workspace-onboarding-workspace/workspace-onboarding-workspace.component';
import { WorkspaceOnboardingYourTeamComponent } from './workspace-onboarding/workspace-onboarding-your-team/workspace-onboarding-your-team.component';
import { WorkspaceOnboardingComponent } from './workspace-onboarding/workspace-onboarding.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspacesComponent } from './workspaces.components';

@NgModule({
  declarations: [
    WorkspacesComponent,
    WorkspaceOnboardingComponent,
    WorkspaceOnboardingWorkspaceComponent,
    WorkspaceOnboardingYourTeamComponent,
    WorkspaceOnboardingAIEmployeeComponent,
    WorkspaceComponent,
    WorkspaceHistoryComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    SettingsWorkspaceModule,
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
    SettingsWorkspaceModule,
    MatToolbarModule,
    SharedModule,
    JobsModule
  ],
})
export class WorkspacesModule { }
