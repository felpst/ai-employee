import { Injectable } from '@angular/core';
import { ICompany, IKnowledge } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  private route = 'knowledges';

  constructor(
    private coreApiService: CoreApiService,
    private authService: AuthService
  ) {}

  create(data: Partial<IKnowledge>): Observable<IKnowledge> {
    data.company =
      (this.authService.user?.company as ICompany)._id ||
      this.authService.user?.company;
    return this.coreApiService.post(this.route, data) as Observable<IKnowledge>;
  }

  list(): Observable<IKnowledge[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}?sort=-createdAt`) as Observable<
          IKnowledge[]
        >
      ).subscribe({
        next: (knowledgeBase: IKnowledge[]) => {
          observer.next(knowledgeBase);
        },
      });
    });
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
}
