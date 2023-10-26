
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { EmployeeService } from '../../workspaces/ai-employee/ai-employee.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'cognum-ai-employee',
  templateUrl: './ai-employee.component.html',
  styleUrls: ['./ai-employee.component.scss'],
})
export class AiEmployeeComponentSettings implements OnInit {
  name = '';
  role='';

  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.minLength(6)]],
    
  
  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  image = '';
  selectedImage: string | null = null;
  workspaceId: string | null = null;
  selectedAvatar: string | null = null;
  isAvatarSelected = false;
  availableAvatars = ['../../../assets/icons/avatar(2).svg'];

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private aiEmployeeService: EmployeeService
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });
    
  }

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }

  onRedirect() {
    this.router.navigate(['/workspaces']);
  }

  ngOnInit() {
    const employeeId = this.route.snapshot.params['employeeId'];
    console.log(employeeId)
    this.aiEmployeeService.getById(employeeId).subscribe({
      next: (response) => {
        this.name = response.name;
        this.role = response.role;
      },
    });
  }

  confirmDeleteAccount() {
    const userId = this.aiEmployeeService.employeeId?._id;

    this.settingsService.deleteUserById(userId).subscribe({
      next: () => {
        this.router.navigate(['/auth/register']);
      },
    });

    this.showDeleteConfirmation = false;
  }

  cancelDeleteAccount() {
    this.showDeleteConfirmation = false;
  }

  validatorFile(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return null;
    const { name, type, size } = file;
    // Tamanho máximo: 10MB
    const maxFileSize = 10 * 1024 * 1024;
    const validFileTypes = ['image/jpeg', 'image/png'];
    const conditionType =
      !validFileTypes.includes(type) ||
      !/jpg$|jpeg$|png$/g.test(name.toLowerCase());
    const conditionSize = !(size <= maxFileSize);

    if (conditionType)
      return { custom: 'Formatos válidos: .png, .jpg e .jpeg' };
    if (conditionSize) return { custom: 'Tamanho máximo: 5MB' };
    return null;
  }



  async onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;

    let name = this.updateForm.get('name')?.value;
    if (!name) {
      name = this.name; // Usar o nome atual se o campo name estiver vazio
    }

    const profilePhoto = this.updateForm.get('profilePhoto')?.value;
    const updateData = JSON.stringify({ name });
    const userId = this.authService.user?._id;

    this.settingsService
      .updateUserById(userId, updateData, profilePhoto)
      .subscribe({
        next: () => {
          this.notificationsService.show('Successfully changed data!');
        },
      });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }
}
