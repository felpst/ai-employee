import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspacesService } from '../workspaces.service';
import {
  AIEmployeesService,
  IAIEmployeeWithChats,
} from './ai-employees.service';
import { ChatsService } from './chats/chats.service';

@Injectable({
  providedIn: 'root',
})
export class AIEmployeesResolver {
  constructor(
    private chatsService: ChatsService,
    private workspacesService: WorkspacesService,
    private aiEmployeesService: AIEmployeesService
  ) {}

  resolve(): Observable<IAIEmployeeWithChats[]> {
    return this.aiEmployeesService.load(this.workspacesService.selectedWorkspace);
  }
}
