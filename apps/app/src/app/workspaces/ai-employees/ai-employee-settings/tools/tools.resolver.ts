import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { IAIEmployee } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AIEmployeesService } from '../../ai-employees.service';

@Injectable({
    providedIn: 'root'
})
export class AIEmployeeToolsResolver {
    constructor(
        private aiEmployeesService: AIEmployeesService,
        private _router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IAIEmployee> {
        const paramMap = route.parent?.paramMap;
        const aiEmployeeId = route.parent?.paramMap.get('id') as string;

        return new Observable((observer) => {
            this.aiEmployeesService.get(aiEmployeeId).subscribe({
                next: (aiEmployee) => {
                    this.aiEmployeesService.aiEmployee = aiEmployee;
                    observer.next(aiEmployee);
                },
                error: (error) => {
                    this._router.navigate(['/']);
                    console.log(error)
                },
            });
        });
    }
}