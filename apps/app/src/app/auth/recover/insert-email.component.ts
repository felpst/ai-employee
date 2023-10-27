import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cognum-insert-email',
  templateUrl: './insert-email.component.html',
  styleUrls: ['./insert-email.component.scss'],
})
export class InsertEmailComponent {
  insertEmailForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  submitting = false;
  showInsertEmailError = false;
  submitSuccess = false;
  errors: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    cookieService: CookieService
  ) {
    const controlEmail = this.insertEmailForm.get('email');

    this.insertEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.insertEmailForm.valueChanges.subscribe(() => {
      this.submitting = false;
      this.showInsertEmailError = false;
    });

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

  onSubmit() {
    if (this.insertEmailForm.valid) {
      this.submitting = true;
      const emailControl = this.insertEmailForm.get('email');

      if (emailControl) {
        const email = emailControl.value;
        this.authService.enterEmail(email).subscribe(
          (response) => {
            this.notificationsService.show(
              `Password recovery initiation successful!`
            );
            this.insertEmailForm.reset();
            this.submitSuccess = true;

            setTimeout(() => {
              this.router.navigate(['auth/login'], {
                queryParams: {
                  message: 'Password recovery link sent to your email.',
                },
              });
            }, 2000);
          },
          (error) => {
            this.notificationsService.show(
              `Password recovery initiation failed!`
            );

            this.showInsertEmailError = true;
            this.errors.push(
              'Password recovery initiation failed. Please try again.'
            );
          }
        );
      }
    }
  }

  private isEmail(s: string) {
    return s?.indexOf('@') !== -1;
  }
}
