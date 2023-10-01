/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
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
    const values = this.loginForm.value;
    console.log({ values });
    this.showLoginError = true;
  }
}
