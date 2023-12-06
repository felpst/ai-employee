import { Injectable } from "@angular/core";
import { IJob } from "@cognum/interfaces";
import { Observable } from "rxjs";
import { AIEmployeesService } from "../ai-employees/ai-employees.service";
import { JobsService } from "./jobs.service";


@Injectable({
  providedIn: 'root',
})
export class JobsResolver {
  constructor(
    private employeesService: AIEmployeesService,
    private jobsService: JobsService,
  ) { }

  resolve(): Observable<IJob[]> {
    return this.jobsService.load(this.employee)
  }

  get employee() {
    return this.employeesService.aiEmployee;
  }
}
