import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
  registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
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
    confirm: ['', [Validators.required]],
  });
  submitting = false;
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
      this.submitting = false;
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
    this.submitting = true;
    const { confirm, ...rest } = this.registerForm.value;

    // Process register
    this.usersService.register({ ...rest }).subscribe({
      next: (token) => {
        const { email, name, password } = rest;
        // Process login
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.submitting = false;
            this.router.navigate(['/']);
            this.notificationsService.show(`Welcome, ${name}!`);
          },
          error: (error) => {
            this.submitting = false;
            console.log('An error ocurred on login: ', { error });
          },
        });
      },
      error: (err) => {
        const { error } = err;
        const { errors } = error ?? { errors: [] };
        this.showRegisterError = true;
        this.errors = errors;
        this.submitting = false;
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
