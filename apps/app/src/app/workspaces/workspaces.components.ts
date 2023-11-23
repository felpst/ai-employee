import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../layouts/loading/loading.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Component({
  selector: 'cognum-workspaces',
  templateUrl: 'workspaces.component.html',
  styleUrls: ['workspaces.component.scss'],
})
export class WorkspacesComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private loadingService: LoadingService,
    private router: Router,
    private cookieService: CookieService
  ) {
    if (!this.authService.user.name) {
      this.router.navigate(['/account/onboarding']);
    }
  }

  ngOnInit() {
    this.onLoadList();
  }

  get user() {
    return this.authService.user;
  }

  get workspaces() {
    return Array.from(this.workspacesService.workspaces.values()).sort(
      (a: IWorkspace, b: IWorkspace) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
    );
  }

  onCreateWorkspace() {
    this.workspacesService
      .create({ users: [{ user: this.authService.user._id, permission: 'Admin' }] } as IWorkspace)
      .subscribe((data) => {
        this.router.navigate(['workspaces', data._id, 'onboarding']);
      });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onLoadList() {
    this.loadingService.add('onWorkspaces');
    this.workspacesService.list().subscribe((data) => {
      this.loadingService.remove('onWorkspaces');
    });
  }

  get username() {
    return this.authService.user ? this.authService.user.name : 'factory';
  }

  get email() {
    return this.authService.user ? this.authService.user.email : '';
  }

  onLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.cookieService.delete('token');
        this.router.navigate(['/auth']);
      },
    });
  }

  onSelectWorkspace(workspaceId: string) {
    this.router.navigate(['/workspaces', workspaceId]);
  }
}
