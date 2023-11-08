import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../layouts/admin/admin.component';
import { HistoryComponent } from './history/history.component';
import { WorkspaceHistoryResolver } from './history/workspace-history.resolver';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { SettingsWorkspaceComponent } from './settings-workspace/settings-workspace.component';
import { WorkspaceOnboardingAIEmployeeComponent } from './workspace-onboarding/workspace-onboarding-ai-employee/workspace-onboarding-ai-employee.component';
import { WorkspaceOnboardingWorkspaceComponent } from './workspace-onboarding/workspace-onboarding-workspace/workspace-onboarding-workspace.component';
import { WorkspaceOnboardingYourTeamComponent } from './workspace-onboarding/workspace-onboarding-your-team/workspace-onboarding-your-team.component';
import { WorkspaceOnboardingComponent } from './workspace-onboarding/workspace-onboarding.component';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesComponent } from './workspaces.components';

const routes: Routes = [
  {
    path: '',
    component: WorkspacesComponent,
  },
  {
    path: ':id',
    resolve: [WorkspaceResolver],
    children: [
      {
        path: 'onboarding',
        component: WorkspaceOnboardingComponent,
        children: [
          {
            path: 'workspace',
            data: { stepper: { select: 0 } },
            component: WorkspaceOnboardingWorkspaceComponent,
          },
          {
            path: 'your-team',
            data: { stepper: { select: 1 } },
            component: WorkspaceOnboardingYourTeamComponent,
          },
          {
            path: 'ai-employee',
            data: { stepper: { select: 2 } },
            component: WorkspaceOnboardingAIEmployeeComponent,
          },
          { path: '**', redirectTo: 'workspace', pathMatch: 'full' },
        ],
      },
      {
        path: 'settings',
        component: SettingsWorkspaceComponent,
      },
      // Admin
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'overview',
            component: WorkspaceComponent,
          },
          {
            path: 'ai-employees',
            loadChildren: () =>
              import('./ai-employees/ai-employees.module').then(
                (m) => m.AIEmployeesModule
              ),
          },
          {
            path: 'history',
            resolve: [WorkspaceHistoryResolver],
            component:  HistoryComponent,
          },
          {
            path: 'knowledge-base',
            component: KnowledgeBaseComponent,
          },
          { path: '**', redirectTo: 'overview', pathMatch: 'full' },
        ]
      },
    ],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
