import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './general/general.component';
import { AIEmployeeToolsComponent } from './tools/tools.component';

const routes: Routes = [
  {
    path: '',
    component: AIEmployeeSettingsComponent,
    children: [
      {
        path: '',
        data: { nav: { select: 0 } },
        component: AIEmployeeGeneralComponent,
      },
      {
        path: 'tools',
        data: { nav: { select: 1 } },
        component: AIEmployeeToolsComponent
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AIEmployeeSettingsRoutingModule { }
