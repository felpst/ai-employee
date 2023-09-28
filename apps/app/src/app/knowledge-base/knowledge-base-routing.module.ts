import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeBaseComponent } from './knowledge-base.component';

const routes: Routes = [
  {
    path: ':workspaceId',
    component: KnowledgeBaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeBaseRoutingModule {}
