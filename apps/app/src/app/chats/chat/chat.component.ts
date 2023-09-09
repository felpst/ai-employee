import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { MessagesService } from '../../services/messages/messages.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ChatsService } from '../chats.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'cognum-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContent', { static: true }) private chatContent!: ElementRef;
  @ViewChild('inputMessage', { static: true })
  private inputMessage!: ElementRef;
  formGroup = new FormGroup({ suggestions: new FormControl('', []) });
  status = 'Ready';

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService
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
    console.log({ message });
    this.updateMessage(message);
  }

  onReprove(messageId: string): void {
    const message = { _id: messageId, rating: 'THUMBSDOWN' };
    console.log({ message });
    this.updateMessage(message);
  }

  onSuggest(): void {
    const values = this.formGroup.value;
    console.log({ values });
  }

  private updateMessage(message: {
    _id: string;
    rating: string;
    suggestions?: string;
  }) {
    return this.messagesService.update(message).subscribe((res) => {
      this.notificationsService.show('Feedback sent!');
      this.openModal(res.rating);
    });
  }

  private openModal(rating: string = ''): void {
    const feedbackModal = new bootstrap.Modal('#feedback-modal', {});
    if (feedbackModal) {
      const feedbackIcon = document.getElementById('feedback-icon');
      const _rating = document.getElementById('rating');
      const styles =
        rating === 'THUMBSUP'
          ? ['fa-thumbs-o-up', 'feedback-up']
          : ['fa-thumbs-o-down', 'feedback-down'];
      if (feedbackIcon) feedbackIcon.classList.add(...styles);
      if (_rating) _rating.setAttribute('value', rating);
      feedbackModal.show();
    }
  }

  private scrollToBottom(): void {
    this.chatContent.nativeElement.scrollTop =
      this.chatContent.nativeElement.scrollHeight;
  }
}
