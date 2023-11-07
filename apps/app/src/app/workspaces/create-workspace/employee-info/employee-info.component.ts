import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { AIEmployeesService } from '../../ai-employees/ai-employees.service';

@Component({
  selector: 'cognum-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
})
export class EmployeeInfoComponent {
  @Input({ required: true }) workspace!: IWorkspace;
  @Output() changeStepEvent = new EventEmitter();
  aiEmployeeForm!: FormGroup;
  photo: File | null = null;
  selectedImage: string | null = null;
  availableAvatars = [
    'https://storage.googleapis.com/cognum-data-sources/avatars/photo.svg',
  ];
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
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

  prevStep() {
    this.changeStepEvent.emit('UsersInfo');
  }

  selectAvatar(avatarPath: string) {
    this.selectedAvatar = avatarPath;
    this.aiEmployeeForm.patchValue({ avatar: avatarPath });

    this.isAvatarSelected = true;
  }

  onSubmit() {
    if (!this.aiEmployeeForm.valid) return;
    this.isLoading = true;
    const workspace = this.workspace._id;
    const { name, description: role, avatar } = this.aiEmployeeForm.value;
    return this.employeeService
      .create({ name, role, avatar, workspace })
      .subscribe(
        (employee) => {
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
