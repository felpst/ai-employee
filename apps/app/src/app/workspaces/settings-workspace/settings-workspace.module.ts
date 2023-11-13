import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SettingsWorkspaceComponent } from './settings-workspace.component';
import { SettingsTeamFormComponent } from './team-form/team-form.component';

@NgModule({
  declarations: [
    SettingsWorkspaceComponent,
    SettingsTeamFormComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
})
export class SettingsWorkspaceModule { }
