import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../services/messages/messages.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ChatsService } from '../chats.service';
import { ChatService } from './chat.service';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

type MessageUpdate = {
  _id: string;
  rating: string;
  suggestions?: string;
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
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {
    route.params.subscribe((params) => {
      this.chatsService.selectedChat = params['id'];
      this.chatService.connect(params['id']);
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
    const message = { _id: messageId, rating: 'THUMBSUP' };
    this.updateMessage(message);
    this.openModal(message);
  }

  onReprove(messageId: string): void {
    const message = { _id: messageId, rating: 'THUMBSDOWN' };
    this.updateMessage(message);
    this.openModal(message);
  }

  private updateMessage(message: MessageUpdate) {
    return this.messagesService.update(message).subscribe((_) => {
      this.chatService.updateMessageData(message._id, message);
      this.notificationsService.show('Feedback sent!');
    });
  }

  private openModal(message: MessageUpdate): void {
    const dialogRef = this.dialog.open(FeedbackFormComponent, {
      width: '600px',
      data: { message },
    });
    dialogRef.afterClosed().subscribe((res) => res);
  }

  private scrollToBottom(): void {
    this.chatContent.nativeElement.scrollTop =
      this.chatContent.nativeElement.scrollHeight;
  }
}
