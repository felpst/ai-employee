import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiEmployeeComponent } from './ai-employee.component';
import { AiEmployeeRoutingModule } from './ai-employee-routing.module';


@NgModule({
  declarations: [
 AiEmployeeComponent
  ],
  imports: [
    CommonModule,
    AiEmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,

  ],
})
export class AiEmployeeModule {}
