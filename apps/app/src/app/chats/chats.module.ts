import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChatComponent } from './chat/chat.component';
import { FeedbackFormComponent } from './chat/feedback-form/feedback-form.component';
import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';

@NgModule({
  declarations: [ChatsComponent, ChatComponent, FeedbackFormComponent],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    FormsModule,
    MarkdownModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    CdkAccordionModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
})
export class ChatsModule {}
