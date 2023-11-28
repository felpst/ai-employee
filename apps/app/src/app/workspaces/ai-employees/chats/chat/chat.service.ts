import { Injectable } from '@angular/core';
import { IAIEmployee, IChatMessage, IChatRoom, IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
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
  private socket!: WebSocket;
  selectedChat!: IChatRoom;
  messages: any[] = [];
  senders = new Map<string, IUser | IAIEmployee>();
  tempMessage!: undefined | Partial<IChatMessage>;

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
  ) { }

  load(chatId: string): Observable<IChatRoom> {
    return new Observable((observer) => {
      this.chatsService.get(chatId).subscribe({
        next: (chat) => {
          this.selectedChat = chat;
          this.connect(chatId);
          observer.next(chat);
        },
      });
    });
  }

  public updateMessageData(_id: string, data: any) {
    const updated = this.messages.map((message) =>
      message._id === _id ? { ...message, ...data } : message
    );
    this.messages = updated;
  }

  private onOpen(event: any) {
    if (!env.production) console.log('Connected to WebSocket server.');
    this.loadingMessages = true;
    this.messages = [];
  }

  private onClose(event: any) {
    if (!env.production) console.log('Disconnected from WebSocket server.');
    this.loadingMessages = false;
  }

  private onMessage(event: any) {
    if (!env.production) console.log('Message received from server.');
    const data: WebSocketMessage = JSON.parse(event.data);
    this.onMessageType[data.type](data.content);
  }

  private get onMessageType() {
    return {
      connection: (data: any) => {
        if (data.isConnected) {
          if (!env.production) console.log('Connection confirmed');
          if (!env.production) console.log('Chat messages', data.chatMessages);
          this.messages = data.chatMessages;

          // senders
          for (const sender of data.senders || []) {
            this.senders.set(sender._id, sender);
          }

        } else {
          if (!env.production) console.error('Connection refused', data.message);
        }
      },
      auth: (data: any) => {
        if (data.isAuthenticated) {
          if (!env.production) console.log('Authenticated');
          // TODO load messages? -> resolver
          // this.selectedChatsService.chats.set(data.chat._id, data.chat);
          // this.messages = data.messages;
          // this.user = data.user;
          // this.aiEmployee = data.aiEmployee;
        }
      },
      message: (data: any) => {
        if (!env.production) console.log('New message received', data);
<<<<<<< HEAD
        this.messages.push(data);
        this.tempMessage = undefined;
      },
      handleMessage: (data: any) => {
        if (!env.production) console.log('[Handle] New message received', JSON.stringify(data));
        this.tempMessage = data;
=======

        // if (data.role === 'AI') {
        //   this.messages.push({
        //     role: 'SYSTEM',
        //     content: {
        //       answer: this.thinking.answer,
        //       thought: this.thinking.thought,
        //       action: this.thinking.action,
        //     },
        //     createdAt: new Date(),
        //   });
        //   this.tokens = '';
        //   this.thinking = { action: '', thought: '', answer: '' };
        // }

        this.messages.push(data);
      },
      handleLLMNewToken: (content: any) => {
        this.tempMessage = {
          content,
          sender: this.selectedChat.aiEmployee,
          role: 'bot',
          chatRoom: this.selectedChat._id,
          createdAt: new Date(),
        } as Partial<IChatMessage>;
      },
      handleChainEnd: (data: any) => {
        this.tempMessage = undefined;
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
      },
      handleLLMNewTokenChatName: (chatName: string) => {
        if (this.selectedChat.name === 'New chat') {
          this.selectedChat.name = '';
        }
        this.selectedChat.name = this.selectedChat.name + chatName;
        this.chatsService.chats.set(this.selectedChat._id as string, this.selectedChat);
        this.chatsService.categorizedChats = this.chatsService.categorizedList();
      },
      handleEndChatName: (chatName: string) => {
        this.selectedChat.name = chatName;
        this.chatsService.chats.set(this.selectedChat._id as string, this.selectedChat);
        this.chatsService.categorizedChats = this.chatsService.categorizedList();
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
          if (!this.selectedChat) return;
          if (this.selectedChat.name === 'New chat' || !this.selectedChat.name) {
            this.selectedChat.name = '';
          }
          this.selectedChat.name = this.selectedChat.name + data.token;
          this.chatsService.chats.set(this.selectedChat._id as string, this.selectedChat);
        }
      },
    };
  }

  send(data: WebSocketMessage) {
    if (!this.socket || !data) return;
    this.socket.send(JSON.stringify(data));
  }

  connect(chatRoomId: string) {
    try {
      if (this.socket) this.socket.close();

      this.socket = new WebSocket(`${env.apis.core.chatUrl}?chatRoomId=${chatRoomId}&token=${this.authService.authToken}`);
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onclose = this.onClose.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
    } catch (error) {
      console.error(error);
    }
  }
}
