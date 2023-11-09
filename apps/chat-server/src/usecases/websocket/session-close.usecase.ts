import { sessionsService } from "../../services/sessions.service";

export class SessionClose {
  execute(sessionId: string) {
    return sessionsService.close(sessionId);
  }
}
