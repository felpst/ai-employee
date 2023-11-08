import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { AIEmployeesService } from '../../workspaces/ai-employees/ai-employees.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';

@Component({
  selector: 'cognum-ai-employee-form',
  templateUrl: './ai-employee-form.component.html',
  styleUrls: ['./ai-employee-form.component.scss'],
})
export class AIEmployeeFormComponent {
  @Input() submitMessage = 'Create AI employee';
  @Output() emitter = new EventEmitter();
  aiEmployeeForm!: FormGroup;
  availableAvatars = [
    'https://storage.googleapis.com/cognum-data-sources/avatars/photo.svg',
  ];
  selectedAvatar: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private workspacesService: WorkspacesService,
    private employeeService: AIEmployeesService,
    private notificationsService: NotificationsService
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
          this.emitter.emit('Finish');
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
