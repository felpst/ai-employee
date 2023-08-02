import { Injectable } from '@angular/core';
import { IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../services/apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: IUser | null = null;
  authToken: string | null = null;

  constructor(private coreApiService: CoreApiService) {}

  login(userCredentials: {
    email: string;
    password: string;
  }): Observable<IUser> {
    return new Observable((observer) => {
      this.coreApiService.post('auth/login', userCredentials).subscribe({
        next: (response) => {
          this.user = response.body as IUser;
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
