import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { KnowledgeBaseComponent } from './knowledge-base.component';

@NgModule({
  declarations: [KnowledgeBaseComponent],
  imports: [
    CommonModule,
    KnowledgeBaseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class KnowledgeBaseModule {}
