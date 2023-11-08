import { Injectable } from '@angular/core';
import { IChat } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AIEmployeesService } from '../ai-employees.service';
import { ChatsService } from './chats.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsResolver {
  constructor(
    private aiEmployeesService: AIEmployeesService,
    private chatsService: ChatsService,
  ) {}

  resolve(): Observable<IChat[]> {
    return this.chatsService.load(this.aiEmployeesService.aiEmployee)
  }
}
