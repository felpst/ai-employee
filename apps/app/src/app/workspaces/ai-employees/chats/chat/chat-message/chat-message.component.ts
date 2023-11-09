import { Component, Input } from "@angular/core";
import { IAIEmployee, IChatMessage, IUser } from "@cognum/interfaces";
import { UtilsService } from "apps/app/src/app/services/utils/utils.service";
import { ChatService } from "../chat.service";

@Component({
  selector: 'cognum-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() message!: IChatMessage;

  constructor(
    public utilsService: UtilsService,
    private chatServices: ChatService
  ) { }

  get sender() {
    return this.chatServices.senders.get(this.message.sender as string) as (IUser | IAIEmployee);
  }
}
