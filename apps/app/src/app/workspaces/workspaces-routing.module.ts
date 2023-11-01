import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { SettingsWorkspaceComponent } from './settings-workspace/settings-workspace.component';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AiEmployeeComponent } from './ai-employee/ai-employee.component';
import { AiEmployeeComponentSettings } from './ai-employee/aiEmployee-settings/ai-employee-settings.component';

const routes: Routes = [
  {
    path: ':id',
    resolve: [WorkspaceResolver],
    children: [
      {
        path: 'overview',
        component: WorkspaceComponent,
      },
      {
        path: 'employees',
        component: AiEmployeeComponent,
      },
      {
        path: 'employee/:id',
        component: AiEmployeeComponentSettings,
      },
      {
        path: 'history',
        component: WorkspaceComponent,
      },
      {
        path: 'settings',
        component: SettingsWorkspaceComponent,
      },
      {
        path: 'knowledge-base',
        component: KnowledgeBaseComponent,
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
