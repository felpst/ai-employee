import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: ':id',
    children: [
      {
        path: 'overview',
        component: WorkspaceComponent,
      },
      {
        path: 'employees',
        component: WorkspaceComponent,
      },
      {
        path: 'history',
        component: WorkspaceComponent,
      },
      {
        path: 'knowledge',
        component: WorkspaceComponent,
      },

      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: ':id/**', redirectTo: 'overview', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
