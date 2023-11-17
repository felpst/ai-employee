import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './general/general.component';

@NgModule({
  declarations: [
    AIEmployeeSettingsComponent,
    AIEmployeeGeneralComponent
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
export class AIEmployeeSettingsModule { }
