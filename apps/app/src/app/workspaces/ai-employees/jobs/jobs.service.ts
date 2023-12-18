/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAIEmployee, IAIEmployeeCall, IJob } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../../../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private route = 'jobs';
  job!: IJob;
  jobs: Map<string, IJob> = new Map<string, IJob>();
  calls: IAIEmployeeCall[] = []

  constructor(private coreApiService: CoreApiService) { }

  get(id: string, options?: any): Observable<IJob> {
    return this.coreApiService.get(
      `${this.route}/${id}`,
      options
    ) as Observable<IJob>;
  }

  loadCalls(job: IJob): Observable<IAIEmployeeCall[]> {
    const jobId = job._id?.toString() as string;

    let params = new HttpParams();
    params = params.set('filter[context.job._id]', jobId);
    params = params.set('sort', '-updatedAt');

    return new Observable((observer) => {
      (
        this.coreApiService.get(this.route + '/calls/', { params }) as Observable<IAIEmployeeCall[]>
      ).subscribe({
        next: (calls: IAIEmployeeCall[]) => {
          this.calls = calls;
          console.log(this.calls);

          observer.next(calls);
        },
      });
    });
  }

  load(aiEmployee: IAIEmployee): Observable<IJob[]> {
    let params = new HttpParams();
    params = params.set('filter[aiEmployee]', aiEmployee._id);
    params = params.set('sort', '-updatedAt');
    return this.list({ params });
  }

  execute(job: IJob): Observable<any> {
    return this.coreApiService.post(`${this.route}/${job._id}/execute`, {}) as Observable<IJob>;
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
          jobs.forEach((job) =>
            this.jobs.set(job._id!, job)
          );
          observer.next(jobs);
        },
      });
    });
  }

  update(item: Partial<IJob>): Observable<IJob> {
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
