import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAIEmployee, IChatRoom } from '@cognum/interfaces';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CoreApiService } from '../../../services/apis/core-api.service';

export interface ICategorizedChats {
  today: { title: string; chats: IChatRoom[]; },
  yesterday: { title: string; chats: IChatRoom[]; },
  last7days: { title: string; chats: IChatRoom[]; },
  older: { title: string; chats: IChatRoom[]; },
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private route = 'chats';
  chats: Map<string, IChatRoom> = new Map<string, IChatRoom>();
  categorizedChats: ICategorizedChats;
  $onUpdate: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private coreApiService: CoreApiService
  ) {
    this.categorizedChats = this.categorizedList();
  }

  load(aiEmployee: IAIEmployee): Observable<IChatRoom[]> {
    let params = new HttpParams();
    params = params.set('filter[aiEmployee]', aiEmployee._id);
    params = params.set('sort', '-updatedAt');
    return new Observable((observer) => {
      this.list({ params }).subscribe({
        next: (chats) => {
          this.chats.clear();
          for (const chat of chats) {
            this.chats.set(chat._id as string, chat);
          }
          observer.next(chats);
        },
      });
    });
  }

  create(chat: Partial<IChatRoom>): Observable<IChatRoom> {
    return this.coreApiService.post('chats', chat) as Observable<IChatRoom>;
  }

  get(chatId: string): Observable<IChatRoom> {
    return this.coreApiService.get(`${this.route}/${chatId}`) as Observable<IChatRoom>;
  }

  list(options?: any): Observable<IChatRoom[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}`, options) as Observable<IChatRoom[]>
      ).subscribe({
        next: (chats: IChatRoom[]) => {
          observer.next(chats);
        },
      });
    });
  }

  listByWorkspace(workspaceId: string): Observable<IChatRoom[]> {
    return this.coreApiService.get(`${this.route}?filter[workspace]=${workspaceId}`) as Observable<IChatRoom[]>;
  }

  delete(chat: IChatRoom): Observable<IChatRoom> {
    this.chats.delete(chat._id as string);
    return this.coreApiService.delete(`chats/${chat._id}`) as Observable<IChatRoom>;
  }

  categorizedList(): ICategorizedChats {
    const list: ICategorizedChats = {
      today: {
        title: 'Today',
        chats: [],
      },
      yesterday: {
        title: 'Yesterday',
        chats: [],
      },
      last7days: {
        title: 'Last 7 days',
        chats: [],
      },
      older: {
        title: 'Older',
        chats: [],
      },
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (const chat of Array.from(this.chats.values())) {
      const createdAt = new Date(chat.createdAt as Date);
      const timeDiff = now.getTime() - createdAt.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 0) {
        list.today.chats.push(chat);
      } else if (daysDiff === 0) {
        list.yesterday.chats.push(chat);
      } else if (daysDiff <= 6) {
        list.last7days.chats.push(chat);
      } else {
        list.older.chats.push(chat);
      }
    }

    this.$onUpdate.next(true);
    return list;
  }
}
