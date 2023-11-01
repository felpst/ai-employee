import { Component, Input } from '@angular/core';

@Component({
  selector: 'cognum-menu-workspace-usage',
  templateUrl: './menu-workspace-usage.component.html',
  styleUrls: ['./menu-workspace-usage.component.scss'],
})
export class WorkspaceUsageComponent {
  @Input() usage = 0;
}
