import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { MatCheckboxModule } from '@angular/material/checkbox';
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
<<<<<<< HEAD
import { AIEmployeeSettingsRoutingModule } from './ai-employee-settings-routing.module';
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './general/general.component';
import { AIToolAddComponent } from './tools/tool-add/tool-add.component';
import { AIToolSettingsDatabaseComponent } from './tools/tool-settings/database/tool-settings-database.component';
import { AIToolSettingsMailSenderComponent } from './tools/tool-settings/mail-sender/tool-settings-mail-sender.component';
import { AIEmployeeToolsComponent } from './tools/tools.component';
=======
import { AIEmployeeSettingsComponent } from './ai-employee-settings.component';
import { AIEmployeeGeneralComponent } from './general/general.component';
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe

@NgModule({
  declarations: [
    AIEmployeeSettingsComponent,
<<<<<<< HEAD
    AIEmployeeGeneralComponent,
    AIEmployeeToolsComponent,
    AIToolAddComponent,
    AIToolSettingsMailSenderComponent,
    AIToolSettingsDatabaseComponent
=======
    AIEmployeeGeneralComponent
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  ],
  imports: [
    RouterModule,
    CommonModule,
<<<<<<< HEAD
    AIEmployeeSettingsRoutingModule,
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
<<<<<<< HEAD
    MatCheckboxModule,
=======
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
    SharedModule
  ],
})
export class AIEmployeeSettingsModule { }
