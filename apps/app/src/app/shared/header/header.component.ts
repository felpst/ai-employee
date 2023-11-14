import { Component, Input } from '@angular/core';

@Component({
  selector: 'cognum-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() logo = '';
  @Input() title = '';
  @Input() showBackButton = false;
}
