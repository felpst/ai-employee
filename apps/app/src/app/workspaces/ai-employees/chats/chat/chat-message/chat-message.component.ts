import { Component, Input } from "@angular/core";
import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IAIEmployeeCall, IChatMessage, IUser } from "@cognum/interfaces";
import { UtilsService } from "../../../../../services/utils/utils.service";
import { ChatService } from "../chat.service";

@Component({
  selector: 'cognum-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() message!: Partial<IChatMessage>;
  showActions = false;

  constructor(
    public utilsService: UtilsService,
    private chatServices: ChatService
  ) { }

  get loading() {
    return !this.message.content || (this.message.call as IAIEmployeeCall)?.status !== 'done';
  }

  get sender() {
    return this.chatServices.senders.get(this.message.sender as string) as (IUser | IAIEmployee);
  }

  get call() {
    return this.message.call as IAIEmployeeCall;
  }

  getTool(id: string) {
    return ToolsHelper.get(id);
  }
}
