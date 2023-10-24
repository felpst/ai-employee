import { Component } from '@angular/core';
import { AuthService } from '../../core/services';

@Component({
  selector: 'cognum-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private authService: AuthService) {}

  get username() {
    return this.authService.user ? this.authService.user.name : 'factory';
  }
}
