import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AIEmployeesService, IAIEmployeeWithChats } from '../ai-employees/ai-employees.service';
import { WorkspacesService } from '../workspaces.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceHistoryResolver {
  constructor(
    private workspacesService: WorkspacesService,
    private aiEmployeesService: AIEmployeesService
  ) {}

  resolve(): Observable<IAIEmployeeWithChats[]> {
    return this.aiEmployeesService.load(this.workspacesService.selectedWorkspace, 10);
  }
}
