import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { EmployeeService } from '../../ai-employee/ai-employee.service';

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
    private employeeService: EmployeeService,
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
    const id = this.workspace._id;
    const { name, description, avatar } = this.aiEmployeeForm.value;
    const json = { name, role: description, avatar, workspace: id };
    const formData = new FormData();
    formData.append('json', JSON.stringify(json));
    return this.employeeService.create(formData).subscribe(
      (_) => {
        this.notificationsService.show('Workspace created successfully');
        this.isLoading = false;
        this.router.navigate(['/workspaces', id]);
      },
      (error) => {
        console.error('Error creating Workspace:', error);
        this.notificationsService.show(
          'Error creating Workspace. Please try again.'
        );
        this.isLoading = false;
      }
    );
  }
}
