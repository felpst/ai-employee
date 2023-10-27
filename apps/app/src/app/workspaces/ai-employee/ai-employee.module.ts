import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiEmployeeComponent } from './ai-employee.component';
import { AiEmployeeRoutingModule } from './ai-employee-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { WhiteAiEmployeeComponent } from './white-ai-employee/white-ai-employee.component';
import { AiEmployeeComponentSettings } from './aiEmployee-settings/ai-employee-settings.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AiEmployeeComponent, WhiteAiEmployeeComponent, AiEmployeeComponentSettings],
  imports: [
    CommonModule,
    AiEmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule
  ],
})
export class AiEmployeeModule {}
