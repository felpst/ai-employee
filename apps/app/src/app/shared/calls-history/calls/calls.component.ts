import { Component, Input } from '@angular/core';
import { ToolsHelper } from '@cognum/helpers';
import { IAIEmployee, IAIEmployeeCall, IUser } from '@cognum/interfaces';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'cognum-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss'],
})
export class CallsComponent {
  @Input() call!: Partial<IAIEmployeeCall>;
  showActions = false;

  constructor(public utilsService: UtilsService) {}

  get loading() {
    return !this.call.input || this.call.status !== 'done';
  }

  get sender() {
    return this.call.createdBy as IUser;
  }

  get aiEmployee() {
    return this.call.aiEmployee as IAIEmployee;
  }

  getTool(id: string) {
    return ToolsHelper.get(id);
  }
}
