import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../../layouts/admin/admin.component';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { AdminAIEmployeeComponent } from './admin-ai-employee/admin-ai-employee.component';
import { AIEmployeeMemoryComponent } from './ai-employee-memory/ai-employee-memory.component';
import { AIEmployeeMemoryResolver } from './ai-employee-memory/ai-employee-memory.resolver';
import { AIEmployeeResolver } from './ai-employee.resolver';
import { AIEmployeesComponent } from './ai-employees.component';
import { AIEmployeesResolver } from './ai-employees.resolver';
import { JobsResolver } from './jobs/jobs.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        resolve: [AIEmployeesResolver],
        component: AIEmployeesComponent,
      }
    ]
  },
  {
    path: ':id',
    component: AdminAIEmployeeComponent,
    resolve: [AIEmployeeResolver],
    children: [
      {
        path: 'overview',
        component: WorkspaceComponent
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('./chats/chats.module').then(
            (m) => m.ChatsModule
          ),
      },
      {
        path: 'jobs',
        resolve: [JobsResolver],
        loadChildren: () =>
          import('./jobs/jobs.module').then(
            (m) => m.JobsModule
          ),
      },
      {
        path: 'memory',
        resolve: [AIEmployeeMemoryResolver],
        component: AIEmployeeMemoryComponent
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./ai-employee-settings/ai-employee-settings.module').then(
            (m) => m.AIEmployeeSettingsModule
          ),
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIEmployeesRoutingModule { }
