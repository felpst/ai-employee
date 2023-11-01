import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIEmployeeSettingsComponent } from './ai-employee-settings/ai-employee-settings.component';
import { AIEmployeesComponent } from './ai-employees.component';

const routes: Routes = [
  {
    path: '',
    component: AIEmployeesComponent,
  },
  {
    path: ':id',
    // TODO create resolver
    children: [
      {
        path: 'settings',
        component: AIEmployeeSettingsComponent,
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIEmployeesRoutingModule {}
