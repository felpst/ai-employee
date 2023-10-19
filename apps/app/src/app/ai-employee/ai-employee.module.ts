import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiEmployeeComponent } from './ai-employee.component';
import { AiEmployeeRoutingModule } from './ai-employee-routing.module';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
 AiEmployeeComponent
  ],
  imports: [
    CommonModule,
    AiEmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
    

  ],
})
export class AiEmployeeModule {}
