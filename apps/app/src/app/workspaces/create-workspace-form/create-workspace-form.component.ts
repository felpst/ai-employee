import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser, IWorkspace } from '@cognum/interfaces';
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
    private workspacesService: WorkspacesService,
    @Inject(MAT_DIALOG_DATA)
    private data: { workspace?: IWorkspace }
  ) {
    const { workspace } = this.data;
    const name = workspace?.name || this.name;
    const description = workspace?.description || this.description;
    const selected = workspace?.users || this.selected;
    this.form = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(description, [Validators.required]),
      selected: new FormControl(selected, []),
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

  get workspace() {
    const { workspace } = this.data;
    return workspace || null;
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
    const data = {
      name,
      description,
      users: this.selected.map(({ _id }) => _id),
    };
    return !this.workspace ? this.onCreate(data) : this.onUpdate(data);
  }

  private onCreate(data: Partial<IWorkspace>) {
    return this.workspacesService.create(data).subscribe({
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

  private onUpdate(data: Partial<IWorkspace>) {
    return this.workspacesService
      .update({ ...this.workspace, ...data })
      .subscribe({
        next: (_) => {
          this.dialogRef.close();
          this.notificationsService.show('Workspace updated successfully!');
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
      const { workspace } = this.data;
      const workspaceUsers =
        workspace && workspace.users.length ? workspace.users : [];
      const _users = user ? users.filter(({ _id }) => _id !== user._id) : users;
      const _usersSelected = _users.filter(({ _id }) =>
        workspaceUsers.includes(_id)
      );
      const availableUsers = _users.filter(
        ({ _id }) => !workspaceUsers.includes(_id)
      );
      this.users = availableUsers;
      this.selected = _usersSelected;
    });
  }
}
