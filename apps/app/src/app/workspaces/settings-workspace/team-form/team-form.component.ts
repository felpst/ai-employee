/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IUser, IWorkspace } from '@cognum/interfaces';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { inListValidator } from '../../../shared/validations';
import { WorkspacesService } from '../../workspaces.service';

export type UserType = { user: IUser, permission: 'Admin' | 'Employee' }

@Component({
  selector: 'cognum-settings-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class SettingsTeamFormComponent {
  permissions = ['Admin', 'Employee'];
  teamForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    permission: ['Employee', [Validators.required, inListValidator(this.permissions)]]
  });
  submitting = false;
  errors = [];
  showDeleteConfirmation = false;
  selectedImage: string | null = null;

  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    public dialog: MatDialog
  ) {
    const controlEmail = this.teamForm.get('email');
    this.teamForm.valueChanges.subscribe(() => {
      this.submitting = false;
    });

    controlEmail?.valueChanges
      .pipe(
        map((value: any) => {
          return value;
        }),
        filter((email) => {
          return email && this.isEmail(email);
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((email) => {
        this.authService.checkEmailRegistered(email).subscribe({
          next: () => {
            // Email registered
            controlEmail.setErrors({
              emailNotExists: null,
            });
            controlEmail.updateValueAndValidity();
          },
          error: () => {
            controlEmail.setErrors({
              emailNotExists: true,
            });
            controlEmail.updateValueAndValidity();
          },
        });
      });
  }

  get user() {
    return this.authService.user
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  get users() {
    const _users = this.workspace.users as UserType[];
    return _users.map(({ permission, user }) => ({ ...user, permission }));
  }

  onRemoveUser(userId: string) {
    const dialogData = new DialogComponent({ title: '', content: 'Are you sure you want to remove this member?', confirmText: 'Yes' });

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const users = this.users.filter(({ _id }) => _id !== userId).map(({ email, permission }) => ({ user: email, permission }));
        return this.updateData({ ...this.workspace, users }, 'User removed successfully!');
      }
      return
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const email = this.teamForm.value.email as string;
      if (email) {
        const userInWorkspace = this.users.find((user) => user.email === email);
        if (userInWorkspace) {
          this.notificationsService.show('User is already in the workspace.');
        } else {
          this.workspacesService.sendEmailToMembers(this.workspace._id, email).subscribe({
            next: () => {
              this.notificationsService.show('Email sent successfully!');
              this.addUserMember();
            },
            error: (error) => {
              console.error('Error sending email:', error);
              this.notificationsService.show('Failed to send email. Please try again.');
            },
          });
        }
      } 
    }
  }  

  addUserMember(){
    const { email, permission } = this.teamForm.value;
    if (!this.teamForm.valid || !email || !permission) return;
    const _users = this.users.map(({ email, permission }) => ({ user: email, permission }));
    this.submitting = true;
    // @ts-ignore
    return this.updateData({ ...this.workspace, users: [..._users, { user: email, permission }] }, 'User added successfully!');
  }
  
  changePermission(target: any, userId: string) {
    const users = this.users.map(user => ({ user: user.email, permission: user._id === userId ? target.value : user.permission }))
    return this.updateData({ ...this.workspace, users }, 'Permission changed successfully!');

  }

  hasInputError(inputName: string, errorName: string) {
    return (
      this.teamForm.get(inputName)?.invalid &&
      this.teamForm.get(inputName)?.touched &&
      this.teamForm.get(inputName)?.hasError(errorName)
    );
  }

  reload() {
    let params = new HttpParams();
    params = params.set('populate[0][path]', 'users.user');
    params = params.set('populate[0][select]', 'name email photo');

    return this.workspacesService.get(this.workspace._id, { params });
  }

  private updateData(data: Partial<IWorkspace>, message: string) {
    return this.workspacesService.update({ ...data }).subscribe({
      next: () => {
        this.reload().subscribe({
          next: (workspace) => {
            this.workspacesService.selectedWorkspace = workspace;
            this.notificationsService.show(message);
            this.submitting = false;
            this.teamForm.reset();
          },
          error: (error) => {
            console.log({ error });
            this.notificationsService.show(
              `An error occurred while fetching workspace details, please try again in a moment`
            );
            this.submitting = false;
            this.teamForm.reset()
          },
        });
      },
      error: () => {
        this.notificationsService.show("Oops, it looks like there was an error... Please try again in a few minutes")
        this.submitting = false;
        this.teamForm.reset()
      }
    });
  }

  private isEmail(s: string) {
    return s?.indexOf('@') !== -1;
  }

}
