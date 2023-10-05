import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'cognum-recover',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class RecoverComponent {
  recoverForm: FormGroup = this.formBuilder.group({
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
  showRecoverError = false;
  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
    const controlPass = this.recoverForm.get('password');
    const controlConfirmPass = this.recoverForm.get('confirm');

    this.recoverForm.valueChanges.subscribe(() => {
      this.submitting = false;
      this.showRecoverError = false;
      this.errors = [];
    });

    controlConfirmPass?.addValidators(
      this.createCompareValidator(controlConfirmPass, controlPass)
    );
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

  onSubmit() {
    console.log(this.recoverForm.value);
  }
}
