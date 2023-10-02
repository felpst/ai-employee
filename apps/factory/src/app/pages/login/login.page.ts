/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'cognum-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit {
  @ViewChild('inputEmail', { static: true })
  private inputEmail!: ElementRef;
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  showLoginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm.valueChanges.subscribe(() => {
      this.showLoginError = false;
    });
  }
  ngAfterViewInit(): void {
    if (this.inputEmail) {
      // @ts-ignore
      this.inputEmail.autofocus = true;
    }
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.loginForm.valid) return;
    return this.authService.login(this.loginForm.value).subscribe({
      next: ({ name }) => {
        console.log({ name });
        this.router.navigate(['/']);
        // this.notificationsService.show(`Welcome, ${name}!`);
      },
      error: () => {
        this.loginForm.reset();
        this.showLoginError = true;
      },
    });
  }
}
