import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { AIEmployeesComponent } from '../ai-employees.component';
import { AIEmployeesService } from '../ai-employees.service';

@Component({
  selector: 'cognum-white-ai-employee',
  templateUrl: './white-ai-employee.component.html',
  styleUrls: ['./white-ai-employee.component.scss'],
})
export class WhiteAiEmployeeComponent {
  form: FormGroup;
  showWarning = false;
  selectedFile: File | null = null;
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  availableAvatars = [
    'https://storage.googleapis.com/cognum-data-sources/avatars/photo.svg',
  ];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AIEmployeesComponent>,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private employeeService: AIEmployeesService
  ) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
      workspace: [data.workspaceId, [Validators.required]],
    });
  }

  selectAvatar(avatarPath: string) {
    this.selectedAvatar = avatarPath;
    this.form.patchValue({ avatar: this.selectedAvatar });
    console.log(this.selectedAvatar);
    this.isAvatarSelected = true;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  createAiEmployee(): void {
    const descriptionControl = this.form.get('description');
    const nameControl = this.form.get('name');

    if (typeof this.selectedAvatar === 'string') {
      const extension = this.selectedAvatar.split('.').pop();
      const blob = new Blob([this.selectedAvatar], { type: 'text/plain' });
      const file = new File([blob], `avatar.${extension}`);
      this.selectedFile = file;
    }

    if (descriptionControl?.valid && nameControl?.valid) {
      const { description: role, name, workspace, avatar } = this.form.value;

      this.isLoading = true;

      this.employeeService.create({ name, role, workspace, avatar }).subscribe(
        (createdEmployee) => {
          this.notificationsService.show('Successfully created Ai Employee');
          console.log(createdEmployee);
          this.isLoading = false;
          this.dialogRef.close('success');
        },
        (error) => {
          console.error('Error creating AI Employee:', error);
          this.notificationsService.show(
            'Error creating Ai Employee. Please try again.'
          );
          this.isLoading = false;
        }
      );
    } else {
      this.showWarning = true;
    }
  }
}
