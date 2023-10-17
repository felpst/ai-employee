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

  updateUserById(userId: string, name: string) {
    return this.coreApiService.put(`users/${userId}`, { name });
  }

  deleteUserById(userId: string) {
    return this.coreApiService.delete(`users/${userId}`);
  }
}
