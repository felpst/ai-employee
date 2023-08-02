import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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

  // Function to handle form submission
  onSubmit() {
    if (!this.loginForm.valid) return;

    // Process login
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.loginForm.reset();
        this.showLoginError = true;
      },
    });
  }
}
