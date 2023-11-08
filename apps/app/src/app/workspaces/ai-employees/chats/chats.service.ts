import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAIEmployee, IChat } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { CoreApiService } from '../../../services/apis/core-api.service';

export interface ICategorizedChats {
  today: { title: string; chats: IChat[]; },
  yesterday: { title: string; chats: IChat[]; },
  last7days: { title: string; chats: IChat[]; },
  older: { title: string; chats: IChat[]; },
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private route = 'chats';
  selectedChat: string | null = null;
  chats: Map<string, IChat> = new Map<string, IChat>();

  constructor(
    private coreApiService: CoreApiService,
    private authService: AuthService
  ) {}

  load(aiEmployee: IAIEmployee): Observable<IChat[]> {
    let params = new HttpParams();
    params = params.set('filter[aiEmployee]', aiEmployee._id);
    params = params.set('sort', '-updatedAt');
    return new Observable((observer) => {
      this.list({ params }).subscribe({
        next: (chats) => {
          this.chats.clear();
          for (const chat of chats) {
            this.chats.set(chat._id, chat);
          }
          observer.next(chats);
        },
      });
    });
  }

  create(chat: Partial<IChat>): Observable<IChat> {
    return this.coreApiService.post('chats', chat) as Observable<IChat>;
  }

  list(options?: any): Observable<IChat[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}`, options) as Observable<IChat[]>
      ).subscribe({
        next: (chats: IChat[]) => {
          observer.next(chats);
        },
      });
    });
  }

 listWorkspaceId(workspaceId: string): Observable<IChat[]> {
  const endpoint = `${this.route}?workspace=${workspaceId}`;

  return this.coreApiService.get(endpoint).pipe(
    map((chats: IChat[]) => {
      this.chats.clear(); // Limpa o mapa de chats antes de adicionar os novos chats
      chats.forEach(chat => this.chats.set(chat._id, chat));
      return chats;
    }),
    catchError(error => {
      console.error(error);
      return [];
    })
  );
}

  

  delete(chat: IChat): Observable<IChat> {
    this.chats.delete(chat._id);
    return this.coreApiService.delete(`chats/${chat._id}`) as Observable<IChat>;
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

    return list;
  }
}
