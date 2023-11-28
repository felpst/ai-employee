import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
=======
import { AIEmployeeSettingsComponent } from './ai-employee-settings/ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './ai-employee-settings/general/general.component';
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
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
<<<<<<< HEAD
        loadChildren: () =>
          import('./ai-employee-settings/ai-employee-settings.module').then(
            (m) => m.AIEmployeeSettingsModule
          ),
=======
        component: AIEmployeeSettingsComponent,
        children: [
          {
            path: '',
            data: { nav: { select: 0 } },
            component: AIEmployeeGeneralComponent,
          },
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
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
