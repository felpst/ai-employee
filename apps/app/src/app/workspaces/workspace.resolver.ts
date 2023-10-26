import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { WorkspacesService } from './workspaces.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceResolver implements Resolve<IWorkspace> {
  constructor(
    private workspacesService: WorkspacesService,
    private _router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWorkspace> {
    const id = route.paramMap.get('id') as string;
    return new Observable((observer) => {
      let params = new HttpParams();
      params = params.set('populate[0][path]', 'users');
      params = params.set('populate[0][select]', 'name email photo');

      this.workspacesService
        .get(id, {
          params,
        })
        .subscribe({
          next: (workspace) => {
            this.workspacesService.selectedWorkspace = workspace;
            observer.next(workspace);
          },
          error: (error) => {
            // TODO show error message to user
            this._router.navigate(['/']);
          },
        });
    });
  }
}
