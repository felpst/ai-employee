import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AIEmployeesComponent } from '../ai-employees.component';

@Component({
  selector: 'cognum-white-ai-employee',
  templateUrl: './white-ai-employee.component.html',
  styleUrls: ['./white-ai-employee.component.scss'],
})
export class WhiteAiEmployeeComponent {
  constructor(private dialogRef: MatDialogRef<AIEmployeesComponent>) {}

  onFinish(event: string) {
    this.dialogRef.close('success');
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
