import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutsModule } from '../layouts/layouts.module';

import { MatIconModule } from '@angular/material/icon';
import { SettingsRoutingModule } from './settings-routing.module';
import { YourAccountComponent } from './your-account/your-account.component';
import { AiEmployeeComponent } from './ai-employee/ai-employee.component';

@NgModule({
  declarations: [YourAccountComponent, AiEmployeeComponent],
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
  ],
})
export class SettingsComponentModule {}
