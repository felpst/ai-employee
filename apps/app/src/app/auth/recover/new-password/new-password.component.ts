import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../services/notifications/notifications.service';
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
  errors: string[] = [];
  cacheInfoData = '@cognum/data';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
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

  ngOnInit() {
    const recoveryId = this.route.snapshot.params['recoveryId'];
    this.authService.validateRecoveryToken(recoveryId).subscribe(
      (validationResult) => {
        if (!validationResult.isValid) {
          this.router.navigate(['auth/login']);
          this.notificationsService.show(
            'Invalid or expired recovery token. Please request a new reset.'
          );
        }
      },
      () => {
        this.router.navigate(['auth/login']);
        this.notificationsService.show('Invalid recovery token.');
      }
    );
  }

  onSubmit() {
    if (this.recoverForm.valid) {
      const recoveryId = this.route.snapshot.params['recoveryId'];
      const passwordControl = this.recoverForm.get('password');

      if (passwordControl) {
        const password = passwordControl.value;
        this.authService.updatePassword(recoveryId, password).subscribe(
          () => {
            this.router.navigate(['auth/login']);
            localStorage.removeItem(this.cacheInfoData);
            this.notificationsService.show('Password recovery successful.');
          },
          () => {
            this.showRecoverError = true;
            this.errors.push('Password update failed. Please try again.');
          }
        );
      }
    }
  }
}
