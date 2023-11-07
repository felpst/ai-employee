import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { AIEmployeesService } from '../../ai-employees/ai-employees.service';
import { WorkspacesService } from '../../workspaces.service';

@Component({
  selector: 'cognum-workspace-onboarding-ai-employee',
  templateUrl: './workspace-onboarding-ai-employee.component.html',
  styleUrls: ['./workspace-onboarding-ai-employee.component.scss'],
})
export class WorkspaceOnboardingAIEmployeeComponent {
  aiEmployeeForm!: FormGroup;
  photo: File | null = null;
  selectedImage: string | null = null;
  availableAvatars = [
    'https://storage.googleapis.com/cognum-data-sources/avatars/photo.svg',
  ];
  selectedAvatar: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private workspacesService: WorkspacesService,
    private employeeService: AIEmployeesService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.aiEmployeeForm = this.formBuilder.group({
      avatar: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.aiEmployeeForm.get(inputName)?.invalid &&
      this.aiEmployeeForm.get(inputName)?.touched &&
      this.aiEmployeeForm.get(inputName)?.hasError(errorName)
    );
  }

  selectAvatar(avatarPath: string) {
    this.selectedAvatar = avatarPath;
    this.aiEmployeeForm.patchValue({ avatar: avatarPath });
  }

  onSubmit() {
    if (!this.aiEmployeeForm.valid) return;
    this.isLoading = true;
    const workspace = this.workspacesService.selectedWorkspace._id;
    const { name, description: role, avatar } = this.aiEmployeeForm.value;
    return this.employeeService
      .create({ name, role, avatar, workspace })
      .subscribe(
        (_: any) => {
          this.notificationsService.show('Workspace created successfully');
          this.isLoading = false;
          this.router.navigate(['/workspaces', workspace]);
        },
        (error: any) => {
          console.error('Error creating Workspace:', error);
          this.notificationsService.show(
            'Error creating Workspace. Please try again.'
          );
          this.isLoading = false;
        }
      );
  }
}
