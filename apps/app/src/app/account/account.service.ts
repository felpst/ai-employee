import { Injectable } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  user: IUser | null = null;

  constructor(private coreApiService: CoreApiService) {}

  // TODO migrar para apps\app\src\app\services\users\users.service.ts
  updateUserById(
    userId: string,
    updateData: string,
    photo: File | null = null
  ) {
    const formData = new FormData();
    formData.append('json', updateData);
    if (photo) formData.append('photo', photo);

    return this.coreApiService.put(`users/${userId}`, formData, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      observe: 'events',
      reportProgress: true,
      responseType: 'json',
    });
  }

  // TODO migrar para apps\app\src\app\services\users\users.service.ts
  deleteUserById(userId: string) {
    return this.coreApiService.delete(`users/${userId}`);
  }
}
