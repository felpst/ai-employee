import { Injectable } from '@angular/core';
import { IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  private route = 'workspaces';
  selectedWorkspace: string | null = null;
  workspaces: Map<string, IWorkspace> = new Map<string, IWorkspace>();
  workspaceData = '@cognum/selected-workspace';

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

  update(workspace: Partial<IWorkspace>): Observable<IWorkspace> {
    return this.coreApiService.put(
      `${this.route}/${workspace._id}`,
      workspace
    ) as Observable<IWorkspace>;
  }

  list(): Observable<Map<string, IWorkspace>> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}/user`, {
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

  onSelectWorkspace(workspaceId: string) {
    this.selectedWorkspace = workspaceId;
    localStorage.setItem(this.workspaceData, workspaceId);
  }
}
