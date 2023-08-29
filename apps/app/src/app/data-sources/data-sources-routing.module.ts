import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSourcesComponent } from './data-sources.component';

const routes: Routes = [
  {
    path: '',
    component: DataSourcesComponent,
    // children: [{ path: ':id', component: Data }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataSourcesRoutingModule {}
