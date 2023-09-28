import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesComponent } from './workspaces.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspacesComponent,
    children: [{ path: ':id', component: WorkspaceComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
