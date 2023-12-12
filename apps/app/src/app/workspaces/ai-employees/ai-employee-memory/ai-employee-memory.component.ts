/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IAIEmployeeMemory } from '@cognum/interfaces';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { AIEmployeesService } from '../ai-employees.service';
import { AIEmployeeMemoryFormComponent } from './ai-employee-memory-form/ai-employee-memory-form.component';

@Component({
  selector: 'cognum-ai-employee-memory',
  templateUrl: './ai-employee-memory.component.html',
  styleUrls: ['./ai-employee-memory.component.scss'],
})
export class AIEmployeeMemoryComponent {
  searchText = '';
  isLoading = true;

  constructor(
    private aiEmployeesService: AIEmployeesService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService
  ) { }

  get aiEmployee() {
    return this.aiEmployeesService.aiEmployee;
  }

  get memory() {
    return this.aiEmployee.memory;
  }

  openForm(index?: number, memory?: IAIEmployeeMemory) {
    this.dialog.open(AIEmployeeMemoryFormComponent, {
      width: '640px',
      data: { memory, index },
    });
  }

}
