import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cognum-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['john@example.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]],
  });
  showLoginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    cookieService: CookieService
  ) {
    this.loginForm.valueChanges.subscribe(() => {
      this.showLoginError = false;
    });

    if (cookieService.check('token')) {
      this.authService.protected().subscribe({
        next: () => {
          // Redirect to chats if user is already logged in
          this.router.navigate(['/']);
        },
      });
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.loginForm.get(inputName)?.invalid &&
      this.loginForm.get(inputName)?.touched &&
      this.loginForm.get(inputName)?.hasError(errorName)
    );
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.loginForm.valid) return;

    // Process login
    this.authService.login(this.loginForm.value).subscribe({
      next: ({ name }) => {
        this.router.navigate(['/']);
        this.notificationsService.show(`Welcome, ${name}!`);
      },
      error: () => {
        this.loginForm.reset();
        this.showLoginError = true;
      },
    });
  }
}
