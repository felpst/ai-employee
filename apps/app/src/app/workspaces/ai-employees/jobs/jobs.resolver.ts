import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { IJob } from "@cognum/interfaces";
import { Observable } from "rxjs";
import { NotificationsService } from "../../../services/notifications/notifications.service";
import { JobsService } from "./jobs.service";


@Injectable({
  providedIn: 'root',
})
export class JobsResolver {
  constructor(
    private jobsService: JobsService,
    private router: Router,
    public route: ActivatedRoute,
    private notificationsService: NotificationsService,
  ) { }

  resolve(routeSnapshot: ActivatedRouteSnapshot): Observable<IJob> {
    const id = routeSnapshot.paramMap.get('id') as string;
    return new Observable((observer) => {
      this.jobsService.get(id)
        .subscribe({
          next: (job) => {
            this.jobsService.job = job;
            observer.next(job);
          },
          error: (error) => {
            console.log({ error });
            this.router.navigate(['../'], { relativeTo: this.route });
            this.notificationsService.show(
              `An error occurred while fetching job details, please try again in a moment`
            );
          },
        });
    });
  }
}
