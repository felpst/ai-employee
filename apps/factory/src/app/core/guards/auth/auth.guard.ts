import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return new Observable((observer) => {
      this.authService.protected().subscribe({
        next: () => {
          observer.next(true);
        },
        error: () => {
          console.error('Invalid token');
          this.router.navigate(['auth']);
          observer.next(false);
        },
      });
    });
  }
}
