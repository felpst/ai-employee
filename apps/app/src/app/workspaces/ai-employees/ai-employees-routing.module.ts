import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIEmployeeSettingsComponent } from './ai-employee-settings/ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './ai-employee-settings/general/general.component';
import { AIEmployeeResolver } from './ai-employee.resolver';
import { AIEmployeesComponent } from './ai-employees.component';
import { AIEmployeesResolver } from './ai-employees.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: [AIEmployeesResolver],
    component: AIEmployeesComponent,
  },
  {
    path: ':id',
    resolve: [AIEmployeeResolver],
    children: [
      {
        path: 'chats',
        loadChildren: () =>
          import('./chats/chats.module').then(
            (m) => m.ChatsModule
          ),
      },
      {
        path: 'settings',
        component: AIEmployeeSettingsComponent,
        children: [
          {
            path: '',
            data: { nav: { select: 0 } },
            component: AIEmployeeGeneralComponent,
          },
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      { path: '**', redirectTo: 'settings', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AIEmployeesRoutingModule { }
