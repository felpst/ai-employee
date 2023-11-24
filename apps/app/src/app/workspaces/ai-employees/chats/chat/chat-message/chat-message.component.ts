import { Component, Input } from "@angular/core";
import { IAIEmployee, IAgentCall, IChatMessage, IUser } from "@cognum/interfaces";
import { UtilsService } from "../../../../../services/utils/utils.service";
import { AIEmployeesService } from "../../../ai-employees.service";
import { ChatService } from "../chat.service";

@Component({
  selector: 'cognum-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() message!: Partial<IChatMessage>;

  constructor(
    public utilsService: UtilsService,
    private chatServices: ChatService,
    private aiEmployeesService: AIEmployeesService
  ) { }

  get sender() {
    return this.chatServices.senders.get(this.message.sender as string) as (IUser | IAIEmployee);
  }

  get call() {
    return this.message.call as IAgentCall;
  }
}
