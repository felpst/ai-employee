import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YourAccountComponent } from './your-account/your-account.component';
import { AiEmployeeComponentSettings } from './ai-employee/ai-employee.component';

const routes: Routes = [
  { path: 'your-account', component: YourAccountComponent },
  { path: 'employee/:id', component: AiEmployeeComponentSettings },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
