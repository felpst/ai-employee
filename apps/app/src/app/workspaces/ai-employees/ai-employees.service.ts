import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAIEmployee, IChat, IWorkspace } from '@cognum/interfaces';
import { Observable, firstValueFrom } from 'rxjs';
import { CoreApiService } from '../../services/apis/core-api.service';
import { ChatsService } from './chats/chats.service';

export interface IAIEmployeeWithChats extends IAIEmployee {
  chats: IChat[];
}

@Injectable({
  providedIn: 'root',
})
export class AIEmployeesService {
  private route = 'employees';
  aiEmployee!: IAIEmployee;
  aiEmployees: IAIEmployeeWithChats[] = [];

  constructor(
    private coreApiService: CoreApiService,
    private chatsService: ChatsService
  ) {}

  load(workspace: IWorkspace): Observable<IAIEmployeeWithChats[]> {
    let params = new HttpParams();
    params = params.set('filter[workspace]', workspace._id);
    params = params.set('sort', '-updatedAt');

    return new Observable((observer) => {
      this.list({ params }).subscribe({
        next: async (aiEmployees) => {
          this.aiEmployees = aiEmployees as IAIEmployeeWithChats[];

          // Load last 3 chats for each employee
          for (const aiEmployee of this.aiEmployees) {
            let params = new HttpParams();
            params = params.set('filter[aiEmployee]', aiEmployee._id);
            params = params.set('sort', '-updatedAt');
            params = params.set('limit', '3');

            aiEmployee.chats =
            await firstValueFrom(this.chatsService.list({ params })) || [];
          }

          observer.next(this.aiEmployees);
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }

  create(employee: Partial<IAIEmployee>): Observable<IAIEmployee> {
    return this.coreApiService.post(`${this.route}`, employee, {
      headers: {
        Accept: 'application/json',
      },
    }) as Observable<IAIEmployee>;
  }

  list(options?: any): Observable<IAIEmployee[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(`${this.route}`, options) as Observable<
          IAIEmployee[]
        >
      ).subscribe({
        next: (chats: IAIEmployee[]) => {
          observer.next(chats);
        },
      });
    });
  }

  listByWorkspace(workspaceId: string): Observable<IAIEmployee[]> {
    return this.coreApiService.get(
      `${this.route}?filter[workspace]=${workspaceId}`
    ) as Observable<IAIEmployee[]>;
  }

  get(aiEmployeeId: string): Observable<IAIEmployee> {
    return this.coreApiService.get(
      `${this.route}/${aiEmployeeId}`
    ) as Observable<IAIEmployee>;
  }

  update(item: Partial<IAIEmployee>): Observable<IAIEmployee> {
    return this.coreApiService.put(
      `${this.route}/${item._id}`,
      item
    ) as Observable<IAIEmployee>;
  }

  delete(item: Partial<IAIEmployee>): Observable<IAIEmployee> {
    return this.coreApiService.delete(
      `${this.route}/${item._id}`
    ) as Observable<IAIEmployee>;
  }
}
