import { Injectable } from '@angular/core';
import { IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  private route = 'workspaces';
  selectedWorkspace!: IWorkspace;
  workspaces: Map<string, IWorkspace> = new Map<string, IWorkspace>();

  constructor(private coreApiService: CoreApiService) {}

  create(workspace: Partial<IWorkspace>): Observable<IWorkspace> {
    return this.coreApiService.post(
      this.route,
      workspace
    ) as Observable<IWorkspace>;
  }

  createWorkspace(formData: FormData): Observable<IWorkspace> {
    return this.coreApiService.post(`${this.route}`, formData, {
      headers: {
        Accept: 'application/json',
      },
    }) as Observable<IWorkspace>;
  }

  get(id: string, options?: any): Observable<IWorkspace> {
    return this.coreApiService.get(
      `${this.route}/${id}`,
      options
    ) as Observable<IWorkspace>;
  }

  update(workspace: Partial<IWorkspace>): Observable<IWorkspace> {
    return this.coreApiService.put(`${this.route}/${workspace._id}`, workspace);
  }

  list(): Observable<Map<string, IWorkspace>> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}`, {
          params: { sort: '-createdAt' },
        }) as Observable<IWorkspace[]>
      ).subscribe({
        next: (workspaces: IWorkspace[]) => {
          workspaces.forEach((workspace) =>
            this.workspaces.set(workspace._id, workspace)
          );
          observer.next(this.workspaces);
        },
      });
    });
  }

  delete(workspacesId: string): Observable<IWorkspace> {
    this.workspaces.delete(workspacesId);
    return this.coreApiService.delete(
      `${this.route}/${workspacesId}`
    ) as Observable<IWorkspace>;
  }

  sendEmailToMembers(workspaceId: string, email: string): Observable<any> {
    return this.coreApiService.post(`${this.route}/${workspaceId}/send-email`, {
      email,
    }) as Observable<any>;
  }
}
