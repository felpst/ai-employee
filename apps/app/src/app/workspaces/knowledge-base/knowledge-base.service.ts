import { Injectable } from '@angular/core';
import { IKnowledge } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  private route = 'knowledges';

  constructor(private coreApiService: CoreApiService) {}

  create(data: Partial<IKnowledge>): Observable<IKnowledge> {
    return this.coreApiService.post(this.route, data) as Observable<IKnowledge>;
  }

  list(): Observable<IKnowledge[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(this.route, {
          params: { sort: '-createdAt' },
        }) as Observable<IKnowledge[]>
      ).subscribe({
        next: (knowledgeBase: IKnowledge[]) => {
          observer.next(knowledgeBase);
        },
      });
    });
  }

  getAllFromWorkspace(workspaceId: string): Observable<IKnowledge[]> {
    return this.coreApiService.get(
      `${this.route}/workspaces/${workspaceId}`
    ) as Observable<IKnowledge[]>;
  }

  update(item: IKnowledge): Observable<IKnowledge> {
    return this.coreApiService.put(
      `${this.route}/${item._id}`,
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
