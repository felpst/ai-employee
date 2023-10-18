import { Injectable } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  user: IUser | null = null;

  constructor(private coreApiService: CoreApiService) {}

  getUserById(userId: string) {
    return this.coreApiService.get(`users/${userId}`);
  }

  updateUserById(
    userId: string,
    updateData: string,
    profilePhoto: File | null = null
  ) {
    const formData = new FormData();
    formData.append('json', updateData);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    return this.coreApiService.put(`users/${userId}`, formData, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      observe: 'events',
      reportProgress: true,
      responseType: 'json',
    });
  }

  deleteUserById(userId: string) {
    return this.coreApiService.delete(`users/${userId}`);
  }
}
