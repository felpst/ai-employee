import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'cognum-your-account',
  templateUrl: './your-account.component.html',
  styleUrls: ['./your-account.component.scss'],
})
export class YourAccountComponent implements OnInit {
  updateForm: FormGroup = this.formBuilder.group({
    name: [name, [Validators.required, Validators.minLength(6)]],
  });
  name = '';
  submitting = false;
  showRegisterError = false;
  errors = [];
  showDeleteConfirmation = false;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }

  ngOnInit() {
    const userId = this.authService.user?._id;

    this.settingsService.getUserById(userId).subscribe({
      next: (response) => {
        this.name = response.name;
      },
    });
  }

  confirmDeleteAccount() {
    const userId = this.authService.user?._id;

    this.settingsService.deleteUserById(userId).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/register']);
      },
      // error: () => {},
    });

    this.showDeleteConfirmation = false;
  }

  cancelDeleteAccount() {
    this.showDeleteConfirmation = false;
  }

  onSubmit() {
    if (!this.updateForm.valid) return;
    this.submitting = true;
    const { confirm, ...rest } = this.updateForm.value;
    const data = rest.name;
    const userId = this.authService.user?._id;

    this.settingsService.updateUserById(userId, data).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }
}
