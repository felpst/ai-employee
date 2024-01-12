import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'apps/app/src/app/services/notifications/notifications.service';
import { validatorFileSize } from 'apps/app/src/app/shared/validations';
import { AIEmployeesService } from '../../ai-employees.service';

@Component({
  selector: 'cognum-ai-employee-file-manager-form',
  templateUrl: './ai-employee-file-manager-form.component.html',
  styleUrls: ['./ai-employee-file-manager-form.component.scss'],
})
export class AIEmployeeFileManagerFormComponent {
  form: FormGroup;
  isUploading = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AIEmployeeFileManagerFormComponent>,
    private aiEmployeesService: AIEmployeesService,
    private notificationsService: NotificationsService
  ) {
    this.form = this.formBuilder.group({
      file: [null, []],
    });
  }

  get aiEmployee() {
    return this.aiEmployeesService.aiEmployee;
  }

  async onFileSelected(event: any): Promise<void> {
    const files = event.target.files;
    const file = files[0] || null;
    if (file) {
      const control = this.form.get('file');
      control?.patchValue(file);
      control?.setValidators(validatorFileSize);
      control?.updateValueAndValidity();
      if (!control?.errors) {
        await this.uploadFiles(file);
      }
    }
    this.toggleDragOverStyles(false);
  }

  async onFileDropped(event: DragEvent): Promise<void> {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    const file = files ? files[0] : null;
    if (file) {
      const control = this.form.get('file');
      control?.patchValue(file);
      control?.setValidators(validatorFileSize);
      control?.updateValueAndValidity();
      if (!control?.errors) {
        await this.uploadFiles(file);
      }
    }
    this.toggleDragOverStyles(false);
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    this.toggleDragOverStyles(true);
  }

  onFileDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.toggleDragOverStyles(false);
  }

  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(event: DragEvent): void {
    this.toggleDragOverStyles(true);
  }

  @HostListener('window:dragleave', ['$event'])
  onWindowDragLeave(event: DragEvent): void {
    this.toggleDragOverStyles(false);
  }

  private toggleDragOverStyles(isDragOver: boolean): void {
    const container = document.getElementById('upload-container');
    const span = document.getElementById('span-upload');

    if (isDragOver) {
      container?.classList.add('drag-over');
      span?.classList.add('span-drag-over');
    } else {
      container?.classList.remove('drag-over');
      span?.classList.remove('span-drag-over');
    }
  }

  closeModal(result: boolean): void {
    this.dialogRef.close(result);
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.form.get(inputName)?.invalid &&
      this.form.get(inputName)?.touched &&
      this.form.get(inputName)?.hasError(errorName)
    );
  }

  private async uploadFiles(file: File) {
    this.isUploading = true;
    return this.aiEmployeesService.createFile(this.aiEmployee, file).subscribe({
      next: () => {
        this.notificationsService.show('File upload successful');
        this.isUploading = false;
        this.closeModal(true);
      },
      error: (error) => {
        this.isUploading = false;
        console.log('An error occurred while uploading the file: ', { error });
        this.notificationsService.show(
          'An error occurred while uploading the file, please try again shortly'
        );
        this.closeModal(false);
      },
    });
  }
}
