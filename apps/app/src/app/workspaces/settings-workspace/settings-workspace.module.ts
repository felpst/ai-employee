import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SettingsWorkspaceComponent } from './settings-workspace.component';
@NgModule({
  declarations: [
    SettingsWorkspaceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
})
export class SettingsWorkspaceModule {}
