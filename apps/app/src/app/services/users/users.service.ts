import { Injectable } from '@angular/core';
import { IToken, IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private route = 'users';
  constructor(private coreApiService: CoreApiService) {}

  list(): Observable<IUser[]> {
    return this.coreApiService.get(`${this.route}`) as Observable<IUser[]>;
  }

  create(item: Partial<IUser>): Observable<IUser> {
    return this.coreApiService.post(`${this.route}`, item) as Observable<IUser>;
  }

  validateToken(
    tokenId: string
  ): Observable<{ isValid: boolean; email?: string }> {
    return this.coreApiService.get(
      `${this.route}/token/${tokenId}`
    ) as Observable<{ isValid: boolean; email?: string }>;
  }

  resendVerifyToken(tokenId: string, email: string): Observable<any> {
    return this.coreApiService.post(`${this.route}/token/${tokenId}/resend`, {
      email,
    }) as Observable<any>;
  }

  verifyToken(tokenId: string, token: string): Observable<any> {
    return this.coreApiService.post(`${this.route}/token/${tokenId}/verify`, {
      token,
    }) as Observable<any>;
  }

  createToken(email: string): Observable<IToken> {
    return this.coreApiService.post(`${this.route}/token`, {
      email,
    }) as Observable<IToken>;
  }

  register(item: Partial<IToken>): Observable<IToken> {
    return this.coreApiService.post(
      `${this.route}/register`,
      item
    ) as Observable<IToken>;
  }
}
