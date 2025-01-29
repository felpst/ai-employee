import { Component, Input } from '@angular/core';
import { IAIEmployeeCall } from '@cognum/interfaces';

@Component({
  selector: 'cognum-calls-history',
  templateUrl: './calls-history.component.html',
  styleUrls: ['./calls-history.component.scss'],
})
export class CallsHistoryComponent {
  @Input({ required: false }) calls: IAIEmployeeCall[] = [];
}
