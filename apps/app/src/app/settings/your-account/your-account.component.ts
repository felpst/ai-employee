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
import { SettingsService } from '../settings.service';

@Component({
  selector: 'cognum-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.scss'],
})
export class YourAccountComponent implements OnInit {
  name = '';
  profilePhoto: File | null = null;
  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.minLength(6)]],
    profilePhoto: [this.profilePhoto, []],
  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  image = '';
  selectedImage: string | null = null;
  workspaceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private workspacesService: WorkspacesService
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
    const userId = this.authService.user?._id;

    this.settingsService.getUserById(userId).subscribe({
      next: (response) => {
        this.image = response.profilePhoto;
        this.name = response.name;
      },
    });
  }

  confirmDeleteAccount() {
    const userId = this.authService.user?._id;

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

  onFileSelected(event: any) {
    try {
      const [file] = event.target.files;
      if (file) {
        this.selectedImage = URL.createObjectURL(file);
        const control = this.updateForm.get('profilePhoto');
        control?.patchValue(file);
        control?.setValidators(this.validatorFile);
        control?.updateValueAndValidity();
        this.profilePhoto = file;
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
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
