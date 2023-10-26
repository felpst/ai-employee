import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YourAccountComponent } from './your-account/your-account.component';

const routes: Routes = [
  { path: 'your-account', component: YourAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
