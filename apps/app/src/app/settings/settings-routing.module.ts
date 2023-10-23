import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsWorkspaceComponent } from './workspace/settings-workspace.component';
import { YourAccountComponent } from './your-account/your-account.component';

const routes: Routes = [
  { path: 'your-account', component: YourAccountComponent },
  { path: 'workspace', component: SettingsWorkspaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
