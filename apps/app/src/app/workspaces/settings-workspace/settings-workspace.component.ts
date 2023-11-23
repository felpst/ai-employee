import { Component } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { AuthService } from '../../auth/auth.service';
import { Step } from '../../shared/stepper/stepper.component';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'cognum-settings-workspace',
  templateUrl: './settings-workspace.component.html',
  styleUrls: ['./settings-workspace.component.scss'],
})
export class SettingsWorkspaceComponent {
  navs: Step[] = [
    { title: 'General', routerLink: 'general' },
    { title: 'Members and Permissions', routerLink: 'team' }
  ]

  showUpdateError = false;
  errors = [];
  showDeleteConfirmation = false;
  selectedImage: string | null = null;

  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
  ) {
  }

  get user() {
    return this.authService.user
  }

  get workspace() {
    return this.workspacesService.selectedWorkspace
  }

  get users() {
    const _users = this.workspace.users as { user: IUser, permission: 'Admin' | 'Employee' }[];
    const result = _users.map(({ permission, user }) => ({ ...user, permission }));
    return [...result, ...result, ...result, ...result, ...result, ...result, ...result, ...result, ...result]
  }

  get email() {
    return this.authService.user ? this.authService.user.email : '';
  }

}
