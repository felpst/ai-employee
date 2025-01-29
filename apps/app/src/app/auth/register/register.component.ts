import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cognum-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  title = 'First, enter your email';
  message = 'We suggest using the email address you use at work';
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[!@#$&*.,])(?=.*[0-9])(?=.*[a-z]).{6,}$/
        ),
      ],
    ],
  });
  isSubmitting = false;
  showRegisterError = false;
  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    const controlPass = this.registerForm.get('password');
    const controlConfirm = this.registerForm.get('confirm');
    const controlEmail = this.registerForm.get('email');

    this.registerForm.valueChanges.subscribe(() => {
      this.isSubmitting = false;
      this.showRegisterError = false;
      this.errors = [];
    });

    controlConfirm?.addValidators(
      this.createCompareValidator(controlConfirm, controlPass)
    );

    controlEmail?.valueChanges
      .pipe(
        map((value: any) => {
          return value;
        }),
        filter((email) => {
          return email && this.isEmail(email);
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((email) => {
        this.authService.checkEmailRegistered(email).subscribe({
          next: () => {
            // Email already registered
            controlEmail.setErrors({
              emailAlreadyExists: true,
            });
          },
          error: () => {
            controlEmail.setErrors({
              emailAlreadyExists: null,
            });
            controlEmail.updateValueAndValidity();
          },
        });
      });
  }

  createCompareValidator(
    controlOne: AbstractControl | null,
    controlTwo: AbstractControl | null
  ) {
    return () => {
      if (!controlOne || !controlTwo) return null;
      if (controlOne.value === controlTwo.value) return null;
      return { match_error: 'Password and confirm fields does not match' };
    };
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.registerForm.get(inputName)?.invalid &&
      this.registerForm.get(inputName)?.touched &&
      this.registerForm.get(inputName)?.hasError(errorName)
    );
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.registerForm.valid) return;
    this.isSubmitting = true;
    const values = this.registerForm.value;

    // Process register
    this.usersService.register({ ...values, timezone: moment.tz.guess() }).subscribe({
      next: (token) => {
        const { email, password } = values;
        // Process login
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/account/onboarding']);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.log('An error ocurred on login: ', { error });
          },
        });
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

  onLogin() {
    return this.router.navigate(['/auth/login']);
  }

  private isEmail(s: string) {
    return s?.indexOf('@') !== -1;
  }
}
