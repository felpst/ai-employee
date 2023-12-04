import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  private route = 'knowledges';
  knowledgeBase!: IKnowledge;
  knowledgeBases: Map<string, IKnowledge> = new Map<string, IKnowledge>();

  constructor(private coreApiService: CoreApiService) { }

  load(workspace: IWorkspace): Observable<IKnowledge[]> {
    let params = new HttpParams();
    params = params.set('filter[workspace]', workspace._id);
    params = params.set('sort', '-updatedAt');

    return this.list({ params });
  }

  create(data: Partial<IKnowledge> | FormData): Observable<IKnowledge> {
    return this.coreApiService.post(this.route, data) as Observable<IKnowledge>;
  }

  list(options?: any): Observable<IKnowledge[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(this.route, options) as Observable<IKnowledge[]>
      ).subscribe({
        next: (knowledgeBases: IKnowledge[]) => {
          observer.next(knowledgeBases);
        },
      });
    });
  }

  getAllFromWorkspace(workspaceId: string): Observable<IKnowledge[]> {
    return this.coreApiService.get(
      `${this.route}/workspaces/${workspaceId}`
    ) as Observable<IKnowledge[]>;
  }

  update(item: IKnowledge | FormData): Observable<IKnowledge> {
    const id = item instanceof FormData ? item.get('_id') : item._id;

    return this.coreApiService.put(
      `${this.route}/${id}`,
      item
    ) as Observable<IKnowledge>;
  }

  delete(item: IKnowledge): Observable<IKnowledge> {
    return this.coreApiService.delete(
      `${this.route}/${item._id}`
    ) as Observable<IKnowledge>;
  }

  userPermission(knowledge: IKnowledge, userId: string): boolean {
    if (knowledge.permissions) {
      const userPermission = knowledge.permissions.find(
        (perm) => perm.userId === userId
      );
      return userPermission?.permission === 'Editor';
    }
    return false;
  }
}
