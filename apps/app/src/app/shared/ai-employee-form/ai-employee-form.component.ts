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
    'https://storage.googleapis.com/factory-assets/avatars/Avatar1.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar2.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar3.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar4.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar5.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar6.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar7.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar8.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar9.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar10.jpeg',
    'https://storage.googleapis.com/factory-assets/avatars/Avatar11.jpeg'

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
<<<<<<< HEAD
    return this.employeeService
      .create({ name, role, avatar, workspace })
=======
    const tools = ['calculator', 'random-number-generator', 'mail-sender', 'serp-api']
    return this.employeeService
      .create({ name, role, avatar, workspace, tools })
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
      .subscribe(
        () => {
          this.notificationsService.show('AI Employee created successfully');
          this.isLoading = false;
          this.emitter.emit('Finish');
        },
        (error) => {
          console.error('Error creating AI Employee:', error);
          this.notificationsService.show(
            'Error creating AI Employee. Please try again.'
          );
          this.isLoading = false;
        }
      );
  }
}
