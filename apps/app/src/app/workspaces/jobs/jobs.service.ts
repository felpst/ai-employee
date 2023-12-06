/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAIEmployee, IJob } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private route = 'jobs';
  job!: IJob;
  jobs: Map<string, IJob> = new Map<string, IJob>();

  constructor(private coreApiService: CoreApiService) { }

  load(employee: IAIEmployee): Observable<IJob[]> {
    let params = new HttpParams();
    params = params.set('filter[employee]', employee._id);
    params = params.set('sort', '-updatedAt');

    return this.list({ params });
  }

  create(data: Partial<IJob>): Observable<IJob> {
    return this.coreApiService.post(this.route, data) as Observable<IJob>;
  }

  list(options?: any): Observable<IJob[]> {
    return new Observable((observer) => {
      (
        this.coreApiService.get(this.route, options) as Observable<IJob[]>
      ).subscribe({
        next: (jobs: IJob[]) => {
          observer.next(jobs);
        },
      });
    });
  }

  update(item: IJob): Observable<IJob> {
    const id = item instanceof FormData ? item.get('_id') : item._id;

    return this.coreApiService.put(
      `${this.route}/${id}`,
      item
    ) as Observable<IJob>;
  }

  delete(item: IJob): Observable<IJob> {
    return this.coreApiService.delete(
      `${this.route}/${item._id}`
    ) as Observable<IJob>;
  }
}
