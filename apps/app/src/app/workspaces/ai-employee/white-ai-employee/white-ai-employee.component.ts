import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AiEmployeeComponent } from '../ai-employee.component';
import { EmployeeService } from '../ai-employee.service';
import { WorkspacesService } from '../../workspaces.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Console } from 'console';


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
    private httpClient: HttpClient,
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
    console.log(this.selectedAvatar)
    this.isAvatarSelected = true;

  }


  closeModal(): void {
    this.dialogRef.close();
  }

  createAiEmployee(): void {
    const descriptionControl = this.form.get('description');
    const nameControl = this.form.get('name');

    if (
      typeof this.selectedAvatar === 'string' 
    ) {
      const extension = this.selectedAvatar.split('.').pop();
      const blob = new Blob([this.selectedAvatar], { type: 'text/plain' });
      const file = new File([blob], `avatar.${extension}`);
      this.selectedFile= file;
    }
  
    if (descriptionControl?.valid && nameControl?.valid) {
      const formData = new FormData();
      formData.append('name', nameControl.value);
      formData.append('role', descriptionControl.value); 
      formData.append('workspace', this.form.get('workspace')?.value ?? '');
  
      const jsonData = {
        name: nameControl.value,
        role: descriptionControl.value,
        workspace: this.form.get('workspace')?.value ?? ''
      };
      formData.append('json', JSON.stringify(jsonData));
   
    
      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile, this.selectedFile.name);
      }
  
      this.isLoading = true;
  
      this.employeeService.create(formData).subscribe(
        (createdEmployee) => {
          this.notificationsService.show('Successfully created Ai Employee');
          console.log(createdEmployee);
          this.isLoading = false;
          this.dialogRef.close('success');
        },
        (error) => {
          console.error('Error creating AI Employee:', error);
          this.notificationsService.show('Error creating Ai Employee. Please try again.');
          this.isLoading = false;
        }
      );
    } else {
      this.showWarning = true;
    }
  }
  
  
  
}
