import { Component, Input } from '@angular/core';
import { IAIEmployeeCall } from '@cognum/interfaces';

@Component({
  selector: 'cognum-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
})
export class ChatHistoryComponent {
  @Input({ required: false }) calls: IAIEmployeeCall[] = [];
}
