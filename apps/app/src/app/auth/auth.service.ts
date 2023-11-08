import { Injectable } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user!: IUser;
  authToken!: string;

  constructor(private coreApiService: CoreApiService) {}

  login(userCredentials: {
    email: string;
    password: string;
  }): Observable<IUser> {
    return new Observable((observer) => {
      this.coreApiService.post('auth/login', userCredentials).subscribe({
        next: (response) => {
          this.user = response as IUser;
          observer.next(this.user);
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  logout() {
    return new Observable((observer) => {
      this.coreApiService.post('auth/logout', {}).subscribe({
        next: () => {
          observer.next(true);
        },
        error: () => {
          observer.error(false);
        },
      });
    });
  }

  checkEmailRegistered(email: string): Observable<IUser> {
    return new Observable((observer) => {
      this.coreApiService.get('auth/email', { params: { email } }).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  updatePassword(recoveryId: string, password: string) {
    return new Observable((observer) => {
      this.coreApiService
        .patch(`users/recovery/${recoveryId}`, { password })
        .subscribe({
          next: (response) => {
            observer.next(response);
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  enterEmail(email: string): Observable<any> {
    const requestBody = { email };
    return new Observable((observer) => {
      this.coreApiService.post('users/recovery', requestBody).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  getUserById(userId: string): Observable<IUser> {
    return this.coreApiService.get(`users/${userId}`);
  }

  validateRecoveryToken(recoveryId: string): Observable<{ isValid: boolean }> {
    return this.coreApiService.get(`users/token/${recoveryId}`);
  }

  protected() {
    return new Observable((observer) => {
      this.coreApiService.get('auth/protected').subscribe({
        next: (data: any) => {
          this.user = data.user;
          this.authToken = data.token;
          observer.next(true);
        },
        error: () => {
          observer.error(false);
        },
      });
    });
  }
}
