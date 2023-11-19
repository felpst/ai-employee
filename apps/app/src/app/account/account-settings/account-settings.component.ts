import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UploadsService } from '../../services/uploads/uploads.service';
import { UsersService } from '../../services/users/users.service';
import { Step } from '../../shared/stepper/stepper.component';
@Component({
  selector: 'cognum-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
  navs: Step[] = [
    { title: 'General', routerLink: './' }
  ]
  name = '';
  photo: File | null = null;
  updateForm = this.formBuilder.group({
    name: [this.name, [Validators.required, Validators.minLength(6)]],
    photo: [this.photo, []],
  });
  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  image = '';
  selectedImage: string | null = null;
  workspaceId: string | null = null;
  defaultImage: string = 'assets/icons/user.svg';

  constructor(
    private location: Location,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private uploadsService: UploadsService,
    private route: ActivatedRoute
  ) {
    this.updateForm.valueChanges.subscribe(() => {
      this.showUpdateError = false;
    });
  }

  openDeleteAccountModal() {
    this.showDeleteConfirmation = true;
  }

  onRedirect() {
    this.location.back();
  }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data;
    if (resolvedData && resolvedData[0]) {
      this.updateForm.patchValue({
        name: resolvedData[0].name,
      });
      this.name = resolvedData[0].name;
      this.image = resolvedData[0].photo;
    }
  }

  confirmDeleteAccount() {
    this.usersService.delete(this.user._id).subscribe({
      next: () => {
        this.router.navigate(['/auth/register']);
      },
    });

    this.showDeleteConfirmation = false;
  }

  cancelDeleteAccount() {
    this.showDeleteConfirmation = false;
  }

  updatePhoto(url: any) {
    console.log({ url });
    this.user.photo = url;
  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.updateForm.get(inputName)?.invalid &&
      this.updateForm.get(inputName)?.touched &&
      this.updateForm.get(inputName)?.hasError(errorName)
    );
  }

  async onSubmit() {
    if (!this.updateForm.valid) return;
    const { name } = this.updateForm.value;
    const data = { ...this.user };
    if (!!name && name.length >= 6) {
      data.name = name;
    }

    this.usersService.update(this.user._id, { ...data }).subscribe({
      next: () => {
        this.notificationsService.show('Successfully changed data!');
      },
    });
  }

  selectedItem: number | null = 1;

  selectItem(itemNumber: number): void {
    this.selectedItem = itemNumber;
  }

  get user() {
    return this.authService.user;
  }
}
