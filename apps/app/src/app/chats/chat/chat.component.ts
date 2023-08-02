import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  status = 'Ready';

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private chatsService: ChatsService
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

  private scrollToBottom(): void {
    this.chatContent.nativeElement.scrollTop =
      this.chatContent.nativeElement.scrollHeight;
  }
}
