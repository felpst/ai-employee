import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAIEmployee } from '@cognum/interfaces'; 
import { AuthService } from '../../auth/auth.service';
import { CoreApiService } from '../../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private route = 'employees';
  employeeId!: IAIEmployee;
  selectedAiEmployees: string | null = null;
 

  constructor(
    private coreApiService: CoreApiService,
    private authService: AuthService
  ) {}

  create(data: Partial<IAIEmployee> | FormData): Observable<IAIEmployee>  {
    return this.coreApiService.post(this.route, data) as Observable<IAIEmployee>;
  }

  list(): Observable<IAIEmployee[]> {
    return this.coreApiService.get(this.route) as Observable<IAIEmployee[]>;
  }

  getById(employeeId: string): Observable<IAIEmployee> {
    return this.coreApiService.get(`${this.route}/${employeeId}`) as Observable<IAIEmployee>;
  }

  update(item: IAIEmployee): Observable<IAIEmployee> {
    return this.coreApiService.put(`${this.route}/${item._id}`, item) as Observable<IAIEmployee>;
  }

  delete(item: IAIEmployee): Observable<IAIEmployee> {
    return this.coreApiService.delete(`${this.route}/${item._id}`) as Observable<IAIEmployee>;
  }
}
