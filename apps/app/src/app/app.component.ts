import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cognum-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'cognum',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cognum.svg')
    ),
      iconRegistry.addSvgIcon(
        'arrow-left',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow-left.svg')
      ),
      iconRegistry.addSvgIcon(
        'logo',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/logo.svg')
      ),
      iconRegistry.addSvgIcon(
        'lock',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/lock.svg')
      ),
      iconRegistry.addSvgIcon(
        'user',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/user.svg')
      );
  }
}
