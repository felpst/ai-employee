import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { IUser } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../services/users/users.service';

@Injectable({
    providedIn: 'root',
})
export class AccountSettingsResolver {
    constructor(
        private usersService: UsersService,
        private _router: Router,
        private authService: AuthService,

    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
        const userId = this.authService.user?._id as string;

        return new Observable((observer) => {
            this.usersService
                .getById(userId)
                .subscribe({
                    next: (user) => {
                        this.usersService.user = user;
                        observer.next(user);
                    },
                    error: (error) => {
                        this._router.navigate(['/']);
                    },
                });
        });
    }
}