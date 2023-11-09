import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { OnboardingComponent } from './onboarding/onboarding.component';

const routes: Routes = [
  { path: '', component: AccountSettingsComponent },
  { path: 'onboarding', component: OnboardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
