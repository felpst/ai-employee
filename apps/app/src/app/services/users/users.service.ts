import { Injectable } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private route = 'users';
  constructor(private coreApiService: CoreApiService) {}

  create(item: Partial<IUser>): Observable<IUser> {
    return this.coreApiService.post(`${this.route}`, item) as Observable<IUser>;
  }

  createCommon(item: Partial<IUser>): Observable<IUser> {
    return this.coreApiService.post(
      `${this.route}/common`,
      item
    ) as Observable<IUser>;
  }
}
