import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../layouts/loading/loading.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Component({
  selector: 'cognum-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private workspacesService: WorkspacesService,
    private loadingService: LoadingService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.onLoadList();
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

  goCreateWorkspace() {
    this.router.navigate(['/create-workspace']);
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
    this.workspacesService.onSelectWorkspace(workspaceId);
    this.router.navigate(['/workspaces', workspaceId]);
  }
}
