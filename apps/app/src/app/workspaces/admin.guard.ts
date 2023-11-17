import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { UserType } from './settings-workspace/team-form/team-form.component';
import { WorkspacesService } from './workspaces.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceAdminGuard {
  constructor(public route: ActivatedRoute, public authService: AuthService, public workspaceService: WorkspacesService, public notificationsService: NotificationsService, public router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return new Observable((observer) => {
      const loggedUser = this.authService.user;
      const users = this.workspaceService.selectedWorkspace?.users as UserType[];

      const _users = users && users.length ? users.map(({ user, permission }) => ({ ...user, permission })) : [];
      const find = _users.find(({ _id }) => _id === loggedUser._id);
      if (!find || find.permission !== 'Admin') {
        this.router.navigate(['..'], { relativeTo: this.route });
        this.notificationsService.show('You do not have permission to access this page!');
        return observer.next(false);
      }
      return observer.next(true);
    });
  }
}
