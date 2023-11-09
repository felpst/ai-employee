import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { IChatRoom } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatResolver {
  constructor(
    private chatService: ChatService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IChatRoom> {
    const id = route.paramMap.get('id') as string;
    return this.chatService.load(id)
  }
}
