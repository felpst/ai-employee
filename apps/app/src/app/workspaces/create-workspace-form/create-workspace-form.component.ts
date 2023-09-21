import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IUser } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UsersService } from '../../services/users/users.service';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-create-workspace-form',
  templateUrl: './create-workspace-form.component.html',
  styleUrls: ['./create-workspace-form.component.scss'],
})
export class CreateWorkspaceFormComponent implements OnInit {
  form!: FormGroup;
  name = '';
  description = '';
  selected: IUser[] = [];
  users: IUser[] = [];
  errors = [];
  submitting = false;
  showCreateError = false;

  constructor(
    private dialogRef: MatDialogRef<CreateWorkspaceFormComponent>,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private authService: AuthService,
    private workspacesService: WorkspacesService
  ) {
    this.form = new FormGroup({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(this.description, [Validators.required]),
      selected: new FormControl(this.selected, []),
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.submitting = false;
      this.showCreateError = false;
      this.errors = [];
    });
    this.getUsers();
  }

  onSelectUser(event: any) {
    const {
      target: { value },
    } = event;
    const currentUsers = this.users;
    const user = currentUsers.find(({ _id }) => _id === value);
    if (user) {
      this.selected = [...this.selected, user];
      this.users = currentUsers.filter(({ _id }) => _id !== value);
    }
  }

  onUnmarkingUser(userId: string) {
    const currentUsers = this.users;
    const selected = this.selected;
    const user = selected.find(({ _id }) => _id === userId);
    if (user) {
      this.users = [...currentUsers, user];
      this.selected = selected.filter(({ _id }) => _id !== userId);
    }
  }

  onSubmit() {
    const { valid, value } = this.form;
    if (!valid) return;
    const { name, description } = value;
    this.workspacesService
      .create({
        name,
        description,
        users: this.selected.map((_id) => _id),
      })
      .subscribe({
        next: (_) => {
          this.dialogRef.close();
          this.notificationsService.show('Workspace created successfully!');
        },
        error: (err) => {
          const { error } = err;
          const { errors } = error ?? { errors: [] };
          this.errors = errors;
          this.submitting = false;
          this.showCreateError = true;
        },
      });
  }

  private getUsers() {
    return this.usersService.list().subscribe((users) => {
      const { user } = this.authService;
      const _users = user ? users.filter(({ _id }) => _id !== user._id) : users;
      this.users = _users;
    });
  }
}
