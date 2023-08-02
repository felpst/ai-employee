import { Injectable } from '@angular/core';
import { IChat, ICompany } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  selectedChat: string | null = null;
  chats: Map<string, IChat> = new Map<string, IChat>();

  constructor(
    private coreApiService: CoreApiService,
    private authService: AuthService
  ) {}

  create(): Observable<IChat> {
    const company =
      (this.authService.user?.company as ICompany)._id ||
      this.authService.user?.company;
    return this.coreApiService.post('chats', { company }) as Observable<IChat>;
  }

  list(): Observable<Map<string, IChat>> {
    return new Observable((observer) => {
      (
        this.coreApiService.get('chats?sort=-createdAt') as Observable<IChat[]>
      ).subscribe({
        next: (chats: IChat[]) => {
          chats.forEach((chat) => this.chats.set(chat._id, chat));
          observer.next(this.chats);
        },
      });
    });
  }

  delete(chat: IChat): Observable<IChat> {
    this.chats.delete(chat._id);
    return this.coreApiService.delete(`chats/${chat._id}`) as Observable<IChat>;
  }
}
