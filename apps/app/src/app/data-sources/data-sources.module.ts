import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { DataSourcesRoutingModule } from './data-sources-routing.module';
import { DataSourcesComponent } from './data-sources.component';

@NgModule({
  declarations: [DataSourcesComponent],
  imports: [
    CommonModule,
    DataSourcesRoutingModule,
    FormsModule,
    MarkdownModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
  ],
})
export class DataSourcesModule {}
