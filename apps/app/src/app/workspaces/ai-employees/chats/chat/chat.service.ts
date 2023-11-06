import { Injectable } from '@angular/core';
import { env } from '../../../../../environments/environment';
import { AuthService } from '../../../../auth/auth.service';
import { ChatsService } from '../chats.service';

export interface WebSocketMessage {
  type: 'auth' | 'message' | 'newToken' | 'connection';
  content: any;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket?: WebSocket;
  messages: any[] = [];
  user: any = null;
  aiEmployee: any = null;
  tokens = '';
  thinking = {
    action: '',
    thought: '',
    answer: '',
  };
  loadingMessages = true;

  constructor(
    private authService: AuthService,
    private chatsService: ChatsService
  ) {}

  public updateMessageData(_id: string, data: any) {
    const updated = this.messages.map((message) =>
      message._id === _id ? { ...message, ...data } : message
    );
    this.messages = updated;
  }

  get chat() {
    if (!this.chatsService.selectedChat) return null;
    return this.chatsService.chats.get(this.chatsService.selectedChat);
  }

  private onOpen(event: any) {
    console.log('Connected to WebSocket server.');
    this.loadingMessages = true;
    this.messages = [];
  }

  private onClose(event: any) {
    console.log('Disconnected from WebSocket server.');
    this.loadingMessages = false;
  }

  private onMessage(event: any) {
    console.log('Message received from server.');
    const data: WebSocketMessage = JSON.parse(event.data);
    this.onMessageType[data.type](data.content);
  }

  private get onMessageType() {
    return {
      connection: (data: any) => {
        if (data.isConnected) {
          this.loadingMessages = true;
          this.send({
            type: 'auth',
            content: {
              token: this.authService.authToken,
            },
          });
        }
      },
      auth: (data: any) => {
        this.chatsService.chats.set(data.chat._id, data.chat);
        this.messages = data.messages;
        this.user = data.user;
        this.aiEmployee = data.aiEmployee;
        this.loadingMessages = false;
      },
      message: (data: any) => {
        console.log('New message received');

        if (data.role === 'AI') {
          this.messages.push({
            role: 'SYSTEM',
            content: {
              answer: this.thinking.answer,
              thought: this.thinking.thought,
              action: this.thinking.action,
            },
            createdAt: new Date(),
          });
          this.tokens = '';
          this.thinking = { action: '', thought: '', answer: '' };
        }

        this.messages.push(data);
      },
      newToken: (data: any) => {
        if (data.type === 'message') {
          this.tokens = this.tokens + data.token;
          if (this.tokens.includes('Final Answer: ')) {
            this.thinking.answer = this.thinking.answer + data.token;
          } else if (this.tokens.includes('Thought: ')) {
            this.thinking.thought = this.thinking.thought + data.token;
          } else {
            this.thinking.action = this.thinking.action + data.token;
          }
        }

        if (data.type === 'chatName') {
          console.log(data);

          if (!this.chat) return;
          console.log('X');

          if (this.chat.name === 'New chat' || !this.chat.name) {
            this.chat.name = '';
          }
          console.log(this.chat.name);

          this.chat.name = this.chat.name + data.token;
          this.chatsService.chats.set(this.chat._id, this.chat);
        }
      },
    };
  }

  send(data: WebSocketMessage) {
    if (!this.socket || !data) return;
    this.socket.send(JSON.stringify(data));
  }

  connect(chatId: string) {
    if (this.socket) this.socket.close();

    this.socket = new WebSocket(`${env.apis.core.chatUrl}?chatId=${chatId}`);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
  }
}
