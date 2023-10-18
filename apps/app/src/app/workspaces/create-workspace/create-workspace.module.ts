import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateWorkspaceComponent } from './create-workspace.component';
@NgModule({
  declarations: [
 CreateWorkspaceComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

  ],
})
export class CreateWorkspaceModule {}
