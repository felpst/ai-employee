import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { NotificationsService } from '../services/notifications/notifications.service';
import { AIEmployeesService } from './ai-employees/ai-employees.service';
import { WorkspacesService } from './workspaces.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceResolver implements Resolve<IWorkspace> {
  constructor(
    private workspacesService: WorkspacesService,
    private aiEmployeeService: AIEmployeesService,
    private notificationsService: NotificationsService,
    private _router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkspace> {
    const id = route.paramMap.get('id') as string;
    return new Observable((observer) => {
      let params = new HttpParams();
      params = params.set('select', 'name photo users.permission');
      params = params.set('populate[0][path]', 'users.user');
      params = params.set('populate[0][select]', 'name email photo');

      this.workspacesService
        .get(id, {
          params,
        })
        .subscribe({
          next: (workspace) => {
            this.workspacesService.selectedWorkspace = workspace;
            const { _id: id, name } = workspace;

            // Redirect to onboarding workspace route if workspace name is not set
            const isOnboardingWorkspaceRoute =
              route.firstChild?.firstChild?.routeConfig?.path === 'workspace';
            if (!name && !isOnboardingWorkspaceRoute) {
              this._router.navigate([
                '/workspaces',
                id,
                'onboarding',
                'workspace',
              ]);
            }

            // Redirect to AI employee onboarding route if workspace is named and has no AI employees
            // const isOnboardingAIEmployeesRoute =
            //   route.firstChild?.firstChild?.routeConfig?.path === 'ai-employee';
            // this.aiEmployeeService.listByWorkspace(id).subscribe((employees) => {
            //   if (
            //     !!name &&
            //     !employees.length &&
            //     !isOnboardingAIEmployeesRoute
            //   ) {
            //     this._router.navigate([
            //       '/workspaces',
            //       id,
            //       'onboarding',
            //       'ai-employee',
            //     ]);
            //   }
            // });


            observer.next(workspace);
          },
          error: (error) => {
            console.log({ error });
            // TODO show error message to user
            this._router.navigate(['/']);
            this.notificationsService.show(
              `An error occurred while fetching workspace details, please try again in a moment`
            );
          },
        });
    });
  }
}
