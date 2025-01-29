/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IAIEmployeeMemory } from '@cognum/interfaces';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { DialogComponent } from 'apps/app/src/app/shared/dialog/dialog.component';
import { AIEmployeesService } from '../../ai-employees.service';

@Component({
  selector: 'cognum-ai-employee-memory-form',
  templateUrl: './ai-employee-memory-form.component.html',
  styleUrls: ['./ai-employee-memory-form.component.scss'],
})
export class AIEmployeeMemoryFormComponent {
  form: FormGroup;
  markdownOptions = {
    showPreviewPanel: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AIEmployeeMemoryFormComponent>,
    private aiEmployeesService: AIEmployeesService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: { memory: IAIEmployeeMemory, index: number }
  ) {
    this.form = this.formBuilder.group({
      pageContent: [data.memory?.pageContent || '', [Validators.required]]
    });
  }

  get aiEmployee() {
    return this.aiEmployeesService.aiEmployee
  }

  async onSave() {
    const { pageContent } = this.form.value;
    if (this.data.index !== undefined) {
      this.aiEmployee.memory[this.data.index].pageContent = pageContent;
    } else {
      this.aiEmployee.memory.push({ pageContent });
    }
    this.aiEmployeesService.update({ _id: this.aiEmployee._id, memory: this.aiEmployee.memory }).subscribe(() => {
      this.notificationsService.show('Memory updated successfully');
      this.dialogRef.close();
    })
  }

  onRemove() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Memory',
        content: 'Are you sure you want to delete this memory?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.data.index !== undefined) {
        this.aiEmployee.memory.splice(this.data.index, 1);
        this.aiEmployeesService.update({ _id: this.aiEmployee._id, memory: this.aiEmployee.memory }).subscribe(() => {
          this.notificationsService.show('Memory updated successfully');
          this.dialogRef.close();
        })
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.form.get(inputName)?.invalid &&
      this.form.get(inputName)?.touched &&
      this.form.get(inputName)?.hasError(errorName)
    );
  }


}
