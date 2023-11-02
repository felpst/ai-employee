import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LayoutsModule } from '../../layouts/layouts.module';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { CreateWorkspaceComponent } from './create-workspace.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { StepperComponent } from './stepper/stepper.component';
import { UsersInfoComponent } from './users-info/users-info.component';
@NgModule({
  declarations: [
    BasicInfoComponent,
    CreateWorkspaceComponent,
    EmployeeInfoComponent,
    StepperComponent,
    UsersInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    LayoutsModule,
  ],
})
export class CreateWorkspaceModule {}
