import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IFeedback } from '@cognum/interfaces';
import { AuthService } from '../../../../auth/auth.service';
import { MessagesService } from '../../../../services/messages/messages.service';
import { NotificationsService } from '../../../../services/notifications/notifications.service';
import { ChatsService } from '../chats.service';
import { ChatService } from './chat.service';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

type MessageUpdate = {
  _id: string;
  isPositive: boolean;
  comment?: string;
};

@Component({
  selector: 'cognum-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContent', { static: true }) private chatContent!: ElementRef;
  @ViewChild('inputMessage', { static: true })
  private inputMessage!: ElementRef;
  status = 'Ready';

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {
    route.params.subscribe((params) => {
      this.chatsService.selectedChat = params['chatId'];
      this.chatService.connect(params['chatId']);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
    this.inputMessage.nativeElement.focus();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const message = form.value.message;

    // Send message over WebSocket
    this.chatService.send({
      type: 'message',
      content: message,
    });
    form.resetForm();
  }

  onApprove(messageId: string): void {
    const message = { _id: messageId, isPositive: true };
    this.updateMessage(message);
  }

  onReprove(messageId: string): void {
    const message = { _id: messageId, isPositive: false };
    this.updateMessage(message);
  }

  isUnratedMessage(messageId: string) {
    const message = this.chatService.messages.find(
      ({ _id }) => _id === messageId
    );
    if (!message) return false;
    const { feedbacks } = message;
    return !feedbacks
      .map(({ createdBy }: any) => createdBy)
      .includes(this.authService.user?._id);
  }

  getMessageFeedback(messageId: string) {
    const message = this.chatService.messages.find(
      ({ _id }) => _id === messageId
    );
    if (!message) return false;
    const { feedbacks } = message;
    const feedback = feedbacks.find(
      ({ createdBy }: any) => createdBy === this.authService.user?._id
    );
    return feedback ? feedback.isPositive : false;
  }

  private updateMessage(message: MessageUpdate) {
    return this.messagesService.addFeedback(message).subscribe((result) => {
      const feedback = result.feedbacks.find(
        ({ createdBy }) => createdBy === this.authService.user?._id
      );
      this.chatService.updateMessageData(message._id, {
        feedbacks: result.feedbacks,
      });
      this.notificationsService.show('Feedback sent!');
      if (feedback) this.openModal(message._id, feedback);
    });
  }

  private openModal(messageId: string, feedback: IFeedback): void {
    const dialogRef = this.dialog.open(FeedbackFormComponent, {
      width: '600px',
      data: { feedback, messageId },
    });
    dialogRef.afterClosed().subscribe((res) => res);
  }

  private scrollToBottom(): void {
    this.chatContent.nativeElement.scrollTop =
      this.chatContent.nativeElement.scrollHeight;
  }
}
