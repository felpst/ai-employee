import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { IChatRoom } from '@cognum/interfaces';
import { Observable, firstValueFrom } from 'rxjs';
import { AIEmployeesService } from '../../ai-employees.service';
import { ChatsService } from '../chats.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    private chatsService: ChatsService,
    private aiEmployeesService: AIEmployeesService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IChatRoom> {
    if (!this.chatService.loading && this.chatService.selectedChat && !this.chatService.messages.length) {
      this.chatsService.delete(this.chatService.selectedChat).subscribe(async () => {
        await firstValueFrom(this.chatsService.load(this.aiEmployeesService.aiEmployee))
        this.chatsService.categorizedChats = this.chatsService.categorizedList();
      });
    }

    const id = route.paramMap.get('id') as string;
    return this.chatService.load(id)
  }
}
