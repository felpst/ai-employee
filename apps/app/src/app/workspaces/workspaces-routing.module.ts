import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceComponent } from './workspace/workspace.component';

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
        path: 'ai-employees',
        loadChildren: () =>
          import('./ai-employees/ai-employees.module').then(
            (m) => m.AIEmployeesModule
          ),
      },

      {
        path: 'history',
        component: WorkspaceComponent,
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
