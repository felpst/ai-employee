import { Component, Input } from "@angular/core";
<<<<<<< HEAD
import { ToolsHelper } from "@cognum/helpers";
import { IAIEmployee, IAgentCall, IChatMessage, IUser } from "@cognum/interfaces";
=======
import { IAIEmployee, IChatMessage, IUser } from "@cognum/interfaces";
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
import { UtilsService } from "../../../../../services/utils/utils.service";
import { ChatService } from "../chat.service";

@Component({
  selector: 'cognum-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() message!: Partial<IChatMessage>;
<<<<<<< HEAD
  showActions = false;

  constructor(
    public utilsService: UtilsService,
    private chatServices: ChatService
  ) { }

  get loading() {
    return !this.message.content || (this.message.call as IAgentCall)?.tasks.find((task: any) => task.status === 'running');
  }

  get sender() {
    return this.chatServices.senders.get(this.message.sender as string) as (IUser | IAIEmployee);
  }

  get call() {
    return this.message.call as IAgentCall;
  }

  getTool(id: string) {
    return ToolsHelper.get(id);
  }
=======

  constructor(
    public utilsService: UtilsService,
    private chatServices: ChatService,
  ) { }

  get sender() {
    return this.chatServices.senders.get(this.message.sender as string) as (IUser | IAIEmployee);
  }
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
}
