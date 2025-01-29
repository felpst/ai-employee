import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UploadsService } from '../../services/uploads/uploads.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'cognum-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  title = 'What’s your name?';
  message =
    'Adding your name and profile photo helps your teammates recognize and connect with you more easily.';
  photo: File | null = null;
  selectedImage: string | null = null;
  onboardingForm!: FormGroup;
  isSubmitting = false;
  showRegisterError = false;
  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private uploadsService: UploadsService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.onboardingForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      photo: [this.photo, []],
    });

    this.onboardingForm.valueChanges.subscribe(() => {
      this.isSubmitting = false;
      this.showRegisterError = false;
      this.errors = [];
    });

    if (this.user.name) {
      this.router.navigate(['/']);
    }
  }

  validatorFile(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return null;
    const { name, type, size } = file;
    // Maximum size: 10MB
    const maxFileSize = 10 * 1024 * 1024;
    const validFileTypes = [
      'image/jpeg',
      'image/png',
      'application/octet-stream',
    ];
    const conditionType =
      !validFileTypes.includes(type) ||
      !/jpg$|jpeg$|png$|svg$/g.test(name.toLowerCase());
    const conditionSize = size > maxFileSize || size <= 0;

    if (conditionType)
      return { invalidFormat: 'Valid formats: .png, .jpg, .jpeg and .svg' };
    if (conditionSize) return { invalidSize: 'Maximum size: 10MB' };
    return null;
  }

  onFileSelected(event: any, folder: string, fieldName = 'avatar') {
    try {
      const [file] = event.target.files;
      if (file) {
        const { name } = file;
        const extension = name.split('.')?.pop() || 'png';
        const filename = `${fieldName}.${extension}`;
        this.selectedImage = URL.createObjectURL(file);
        const control = this.onboardingForm.get('photo');
        control?.patchValue(file);
        control?.setValidators(this.validatorFile);
        control?.updateValueAndValidity();
        this.photo = file;
        this.uploadsService
          .single({
            file,
            folder,
            filename,
            parentId: this.user._id,
          })
          .subscribe((result) => {
            this.user.photo = result.url;
          });
      }
    } catch (error) {
      console.log('An error ocurring: ', { error });
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.onboardingForm.get(inputName)?.invalid &&
      this.onboardingForm.get(inputName)?.touched &&
      this.onboardingForm.get(inputName)?.hasError(errorName)
    );
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.onboardingForm.valid) return;
    this.isSubmitting = true;
    const { name } = this.onboardingForm.value;
    this.usersService.update(this.user._id, { ...this.user, name }).subscribe({
      next: (user) => {
        this.authService.user = user;
        this.isSubmitting = false;
        this.router.navigate(['/']);
        this.notificationsService.show(`Welcome, ${name}!`);
      },
      error: (err) => {
        const { error } = err;
        const { errors } = error ?? { errors: [] };
        this.showRegisterError = true;
        this.errors = errors;
        this.isSubmitting = false;
      },
    });
  }

  get user() {
    return this.authService.user;
  }
}
