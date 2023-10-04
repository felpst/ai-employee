import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false, []],
  });
  showLoginError = false;
  cacheInfoData = '@cognum/data';

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
  ngOnInit(): void {
    const data = localStorage.getItem(this.cacheInfoData);
    if (data) {
      const { email, password } = JSON.parse(atob(data));
      this.loginForm.get('email')?.setValue(email);
      this.loginForm.get('password')?.setValue(password);
      this.loginForm.get('remember')?.setValue(true);
    }
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.loginForm.get(inputName)?.invalid &&
      this.loginForm.get(inputName)?.touched &&
      this.loginForm.get(inputName)?.hasError(errorName)
    );
  }

  onForgot() {
    return this.router.navigate(['/auth/recover']);
  }

  onRegister() {
    return this.router.navigate(['/auth/register']);
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.loginForm.valid) return;
    const { remember, ...rest } = this.loginForm.value;
    if (remember) {
      const data = JSON.stringify(rest);
      localStorage.setItem(this.cacheInfoData, btoa(data));
    } else localStorage.removeItem(this.cacheInfoData);

    // Process login
    this.authService.login(rest).subscribe({
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
