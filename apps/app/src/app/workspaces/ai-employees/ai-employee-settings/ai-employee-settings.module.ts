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
import { AIToolSettingsGoogleCalendarComponent } from './tools/tool-settings/google-calendar/tool-settings-google-calendar.component';
import { AIToolSettingsLinkedInLeadScraperComponent } from './tools/tool-settings/linkedin-lead-scraper/tool-settings-linkedin-lead-scraper.component';
import { AIToolSettingsMailReaderComponent } from './tools/tool-settings/mail/mail-reader/tool-settings-mail-reader.component';
import { AIToolSettingsMailSenderComponent } from './tools/tool-settings/mail/mail-sender/tool-settings-mail-sender.component';
import { AIToolSettingsMailComponent } from './tools/tool-settings/mail/tool-settings-mail.component';
import { AIToolSettingsSQLConnectorComponent } from './tools/tool-settings/sql-connector/tool-settings-sql-connector.component';
import { AIEmployeeToolsComponent } from './tools/tools.component';
@NgModule({
  declarations: [
    AIEmployeeSettingsComponent,
    AIEmployeeGeneralComponent,
    AIEmployeeToolsComponent,
    AIToolAddComponent,
    AIToolSettingsMailComponent,
    AIToolSettingsMailSenderComponent,
    AIToolSettingsMailReaderComponent,
    AIToolSettingsSQLConnectorComponent,
    AIToolSettingsLinkedInLeadScraperComponent,
    AIToolSettingsGoogleCalendarComponent
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
