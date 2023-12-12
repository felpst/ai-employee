import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from '@cognum/interfaces';
import * as moment from 'moment-timezone';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Step } from '../../shared/stepper/stepper.component';
@Component({
  selector: 'cognum-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  navs: Step[] = [
    { title: 'General', routerLink: './' }
  ]
  updateForm: FormGroup;

  timezones: {
    name: string;
    value: string;
  }[] = []
  selectedTimezone: { name: string; value: string; };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService
  ) {
    moment.tz.names().forEach((name) => {
      this.timezones.push({
        name: `(GMT${moment.tz(name).format('Z')}) ${name}`,
        value: name,
      });
    });
    this.timezones.sort((a, b) => a.name.localeCompare(b.name));
    this.selectedTimezone = this.timezones.find(({ value }) => value === this.usersService.user.timezone || moment.tz.guess()) || this.timezones[0];

    this.updateForm = this.formBuilder.group({
      name: [this.usersService.user.name, [Validators.required, Validators.minLength(6)]],
      timezone: [this.usersService.user.timezone, [Validators.required]],
    });

    this.updateForm.valueChanges.subscribe((data) => {
      if (this.updateForm.valid) {
        this.onSubmit()
      }
    });
  }

  updatePhoto(url: string) {
    this.user.photo = url;
    return this.updateData({ photo: url });
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
    const data = this.updateForm.value;
    return this.updateData(data);
  }

  onDeleteUser() {
    const dialogData = new DialogComponent({ title: 'Delete', content: 'Are you sure you want to delete your account?', confirmText: 'Yes' });

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteUser();
      }
    });
  }

  get user() {
    return this.authService.user;
  }

  private updateData(data: Partial<IUser>) {
    this.usersService.update(this.user._id, data).subscribe({
      next: (user) => {
        this.authService.user = user;
        this.notificationsService.show('Successfully changed data!');
      },
      error: (error) => {
        console.log('An error occurred while updating the information', { error });
        this.notificationsService.show('An error occurred while updating the data, please try again in a moment');
      }
    });
  }

  private deleteUser() {
    this.usersService.delete(this.user._id).subscribe({
      next: () => {
        this.authService.logout();
        this.cookieService.delete('token');
        this.notificationsService.show('Operation carried out successfully!');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.log('An error occurred while deleting information', { error });
        this.notificationsService.show('There was an error deleting your account, please try again in a moment');
      }
    });
  }
}
