import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: ':id',
    component: WorkspaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
