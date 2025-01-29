import { WebSocket } from "ws";
import { sessionsService } from "../../services/sessions.service";

export class SessionCreate {
  constructor(
    private socket: WebSocket
  ) { }

  execute() {
    return sessionsService.create(this.socket);
  }
}
