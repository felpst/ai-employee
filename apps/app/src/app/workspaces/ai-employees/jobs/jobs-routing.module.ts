import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobHistoryComponent } from './job-details/history/job-history.component';
import { JobHistoyResolver } from './job-details/history/job-history.resolver';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobOverviewComponent } from './job-details/overview/job-overview.component';
import { JobSettingsFormComponent } from './job-details/settings/job-settings-form.component';
import { JobsComponent } from './jobs.component';
import { JobsResolver } from './jobs.resolver';


const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
  },
  {
    path: ':id',
    resolve: [JobsResolver],
    component: JobDetailsComponent,
    children: [
      {
        path: 'overview',
        data: { nav: { select: 0 } },
        component: JobOverviewComponent
      },
      {
        path: 'history',
        resolve: [JobHistoyResolver],
        data: { nav: { select: 1 } },
        component: JobHistoryComponent
      },
      {
        path: 'settings',
        data: { nav: { select: 2 } },
        component: JobSettingsFormComponent
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule { }
