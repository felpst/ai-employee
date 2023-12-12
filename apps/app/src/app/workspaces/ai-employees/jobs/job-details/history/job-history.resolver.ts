import { Injectable } from '@angular/core';
import { IAIEmployeeCall } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AIEmployeesService } from '../../../ai-employees.service';
import { ChatService } from '../../../chats/chat/chat.service';
import { JobsService } from '../../jobs.service';

@Injectable({
  providedIn: 'root',
})
export class JobHistoyResolver {
  constructor(
    private aiEmployeesService: AIEmployeesService,
    private jobsService: JobsService,
    private chatService: ChatService
  ) { }

  resolve(): Observable<IAIEmployeeCall[]> {
    this.chatService.senders.set(this.aiEmployeesService.aiEmployee._id, this.aiEmployeesService.aiEmployee)
    return this.jobsService.loadCalls(this.jobsService.job);
  }
}
