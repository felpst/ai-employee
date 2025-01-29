import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AIEmployeesService } from './ai-employees.service';

@Injectable({
  providedIn: 'root',
})
export class AIEmployeeResolver {
  constructor(
    private aiEmployeesService: AIEmployeesService,
    private _router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IAIEmployee> {
    const id = route.paramMap.get('id') as string;
    return new Observable((observer) => {
      this.aiEmployeesService
        .get(id)
        .subscribe({
          next: (aiEmployee) => {
            this.aiEmployeesService.aiEmployee = aiEmployee;
            observer.next(aiEmployee);
          },
          error: () => {
            // TODO show error message to user
            this._router.navigate(['/']);
          },
        });
    });
  }
}
