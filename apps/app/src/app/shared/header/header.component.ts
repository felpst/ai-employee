import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cognum-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() logo = '';
  @Input() title = '';
  @Input() showBackButton = false;
  @Input() backURL = '';

  constructor(private _location: Location, private _router: Router) { }

  onBack() {
    if (this.backURL) {
      return this._router.navigate([this.backURL]);
    }
    return this._location.back();
  }
}
