import { Component, Input } from '@angular/core';

@Component({
  selector: 'cognum-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent {
  @Input({ required: true }) title!: string;
  @Input() message = '';
  @Input() showFooter = true;
}
