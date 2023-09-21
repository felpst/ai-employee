import { Injectable } from '@angular/core';
import { IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  selectedWorkspace: string | null = null;
  workspaces: Map<string, IWorkspace> = new Map<string, IWorkspace>();

  constructor(private coreApiService: CoreApiService) {}

  create(workspace: Partial<IWorkspace>): Observable<IWorkspace> {
    return this.coreApiService.post(
      'workspaces',
      workspace
    ) as Observable<IWorkspace>;
  }

  get(id: string): Observable<IWorkspace> {
    return this.coreApiService.get(
      `workspaces/${id}`
    ) as Observable<IWorkspace>;
  }

  list(): Observable<Map<string, IWorkspace>> {
    return new Observable((observer) => {
      (
        this.coreApiService.get('workspaces?sort=-createdAt') as Observable<
          IWorkspace[]
        >
      ).subscribe({
        next: (workspaces: IWorkspace[]) => {
          workspaces.forEach((chat) => this.workspaces.set(chat._id, chat));
          observer.next(this.workspaces);
        },
      });
    });
  }

  delete(chat: IWorkspace): Observable<IWorkspace> {
    this.workspaces.delete(chat._id);
    return this.coreApiService.delete(
      `workspaces/${chat._id}`
    ) as Observable<IWorkspace>;
  }
}
