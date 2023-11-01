import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../shared/shared.module';
import { AIEmployeeSettingsComponent } from './ai-employee-settings/ai-employee-settings.component';
import { AIEmployeesRoutingModule } from './ai-employees-routing.module';
import { AIEmployeesComponent } from './ai-employees.component';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';

@NgModule({
  declarations: [AIEmployeesComponent, WhiteAiEmployeeComponent, AIEmployeeSettingsComponent],
  imports: [
    CommonModule,
    AIEmployeesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    SharedModule
  ],
})
export class AIEmployeesModule {}
