import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AiEmployeeComponent } from '../ai-employee.component';
import { EmployeeService } from '../ai-employee.service';
import { WorkspacesService } from '../../workspaces.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';


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
  availableAvatars = ['../../../assets/icons/avatar(2).svg'];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AiEmployeeComponent>,
    private notificationsService: NotificationsService,
    private workspacesService: WorkspacesService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private employeeService: EmployeeService) {

    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
      workspace: [data.workspaceId, [Validators.required]]
    });

  }


  selectAvatar(avatarPath: string) {

    this.selectedAvatar = avatarPath;
    this.form.patchValue({ avatar: this.selectedAvatar });
    this.isAvatarSelected = true;

  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.form.patchValue({ avatar: this.selectedFile });
      this.isAvatarSelected = true;
    }
  }



  closeModal(): void {
    this.dialogRef.close();
  }

  createAiEmployee(): void {
    if (this.form && this.form.valid) {
      const descriptionControl = this.form.get('description');
      const nameControl = this.form.get('name');


      if (descriptionControl && nameControl) {
        const avatarValue: string = this.selectedAvatar || '';
        console.log('Selected Avatar:', this.selectedAvatar);
        const aiEmployeeData = {
          name: nameControl.value,
          role: descriptionControl.value,
          avatar: avatarValue,
          workspace: this.form.get('workspace')?.value ?? null

        };
        console.log(aiEmployeeData)
        this.isLoading = true;
        this.employeeService.create(aiEmployeeData).subscribe(
          (createdEmployee) => {
            this.notificationsService.show('Successfully created Ai Employee');
            console.log(createdEmployee);
            this.isLoading = false;
            this.dialogRef.close('success');
          },
          (error) => {
            console.error('Error creating AI Employee:', error);
            this.notificationsService.show('Error creating Ai Employee. Please try again.');
          }
        );
      } else {
        this.showWarning = true;
        return;
      }
    }
  }

}
