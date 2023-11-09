import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatIconModule } from '@angular/material/icon';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './account-routing.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { OnboardingComponent } from './onboarding/onboarding.component';

@NgModule({
  declarations: [AccountSettingsComponent, OnboardingComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatToolbarModule,
    LayoutsModule,
    SharedModule,
  ],
})
export class AccountModule {}
