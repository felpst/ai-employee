import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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
    name: [this.name, [Validators.required, Validators.minLength(6)]],
    profilePhoto: [this.profilePhoto, []],
  });
  submitting = false;
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });
  }

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }

  ngOnInit() {
    const userId = this.authService.user?._id;

    this.settingsService.getUserById(userId).subscribe({
      next: (response) => {
        this.name = response.name;
      },
    });
  }

  confirmDeleteAccount() {
    const userId = this.authService.user?._id;

    this.settingsService.deleteUserById(userId).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/register']);
      },
      // error: () => {},
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
    const { name, profilePhoto } = this.updateForm.value;
    const updateData = JSON.stringify({ name });
    const userId = this.authService.user?._id;
    this.settingsService
      .updateUserById(userId, updateData, profilePhoto)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
      });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }
}
