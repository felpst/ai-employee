import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AIEmployeeSettingsRoutingModule } from './ai-employee-settings-routing.module';
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './general/general.component';
import { AIToolAddComponent } from './tools/tool-add/tool-add.component';
import { AIToolSettingsDatabaseComponent } from './tools/tool-settings/database/tool-settings-database.component';
import { AIToolSettingsMailSenderComponent } from './tools/tool-settings/mail-sender/tool-settings-mail-sender.component';
import { AIEmployeeToolsComponent } from './tools/tools.component';

@NgModule({
  declarations: [
    AIEmployeeSettingsComponent,
    AIEmployeeGeneralComponent,
    AIEmployeeToolsComponent,
    AIToolAddComponent,
    AIToolSettingsMailSenderComponent,
    AIToolSettingsDatabaseComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    AIEmployeeSettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    SharedModule
  ],
})
export class AIEmployeeSettingsModule { }
