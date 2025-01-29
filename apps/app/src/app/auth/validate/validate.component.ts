import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'cognum-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss'],
})
export class ValidateComponent implements OnInit, AfterViewInit {
  @ViewChildren('tokenInput')
  tokenInputs!: QueryList<ElementRef>;
  validateForm: FormGroup = this.formBuilder.group({
    token: [this.formBuilder.array([]), [Validators.required]],
  });
  tokenId = '';
  email = '';
  submitting = false;
  loadingData = true;
  showTokenError = false;
  errors = [];
  cacheInfoData = '@cognum/data';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.validateForm.valueChanges.subscribe(() => {
      this.submitting = false;
      this.showTokenError = false;
      this.errors = [];
    });
  }
  ngOnInit(): void {
    this.loadingData = true;
    const tokenId = this.route.snapshot.params['tokenId'];
    this.usersService.validateToken(tokenId).subscribe(
      (result) => {
        const { email, isValid } = result;
        if (!isValid) {
          this.router.navigate(['auth/register']);
          this.notificationsService.show(
            'Invalid or expired register token. Please request new.'
          );
        }
        this.email = email || '';
        this.loadingData = false;
        this.tokenId = tokenId;
      },
      () => {
        this.router.navigate(['auth/register']);
        this.notificationsService.show('Invalid register token.');
      }
    );
  }

  ngAfterViewInit() {
    this.tokenInputs.first.nativeElement.focus();
  }

  onInputKeyup(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const enteredChar = input.value;
    input.value = '';
    const digits = enteredChar.replace(/\D/g, '');
    if (digits) {
      const lastDigit = digits.charAt(digits.length - 1);
      input.value = lastDigit;
      this.addItem(index, lastDigit);
      const nextIndex = index + 1;
      if (nextIndex < this.tokenInputs.length) {
        this.tokenInputs.toArray()[nextIndex].nativeElement.focus();
      }
      if (this.isTokenFilled) {
        this.onSubmit();
        this.tokenInputs.last.nativeElement.blur();
      }
    }
  }

  get token(): FormArray {
    return this.validateForm.get('token')?.value as FormArray;
  }

  get disableInputs() {
    return this.submitting || this.loadingData;
  }

  addItem(index: number, value: string) {
    const token = this.token.value;
    token.splice(index, 1, value);
  }

  get isTokenFilled(): boolean {
    const token = this.token.value;
    return token.length === 6 && token.every((digit: string) => !!digit);
  }

  // Function to handle form submission
  onSubmit() {
    const token = this.token.value.join('');
    this.submitting = true;
    this.usersService.verifyToken(this.tokenId, token).subscribe({
      next: () => {
        const data = localStorage.getItem(this.cacheInfoData);
        if (data) {
          const { email, password } = JSON.parse(atob(data));
          // Process login
          this.authService.login({ email, password }).subscribe({
            next: () => {
              this.submitting = false;
              localStorage.removeItem(this.cacheInfoData);
              this.router.navigate(['/']);
            },
            error: (error) => {
              this.submitting = false;
              console.log('An error ocurred on login: ', { error });
            },
          });
        }
      },
      error: (err) => {
        const { error } = err;
        const { errors } = error ?? { errors: [] };
        this.showTokenError = true;
        this.errors = errors;
        this.submitting = false;
      },
    });
  }

  onResend() {
    this.submitting = true;
    this.usersService.resendVerifyToken(this.tokenId, this.email).subscribe(
      () => {
        this.submitting = false;
      },
      () => {
        this.submitting = false;
      }
    );
  }
}
