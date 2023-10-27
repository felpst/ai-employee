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

  get(id: string): Observable<IWorkspace> {
    return this.coreApiService.get(
      `${this.route}/${id}`
    ) as Observable<IWorkspace>;
  }

  update(
    workspaceId: string,
    updateData: string,
    profilePhoto: File | null = null
  ) {
    const formData = new FormData();
    formData.append('json', updateData);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    return this.coreApiService.put(`${this.route}/${workspaceId}`, formData, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      observe: 'events',
      reportProgress: true,
      responseType: 'json',
    });
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

  delete(chat: IWorkspace): Observable<IWorkspace> {
    this.workspaces.delete(chat._id);
    return this.coreApiService.delete(
      `${this.route}/${chat._id}`
    ) as Observable<IWorkspace>;
  }
}
