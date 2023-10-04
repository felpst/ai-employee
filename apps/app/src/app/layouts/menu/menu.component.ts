import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'cognum-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    iconRegistry.addSvgIcon(
      'cognum',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cognum.svg')
    );
  }

  onLink(url: string) {
    this.router.navigate([url]);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
        this.cookieService.delete('token');
      },
    });
  }
}
