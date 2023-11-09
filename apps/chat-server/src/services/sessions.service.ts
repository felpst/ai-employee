import { WebSocket } from "ws";
import { Session } from "../entities/session.entity";

class SessionsService {
  private sessions = new Map<string, Session>();

  create(socket: WebSocket) {
    const session = new Session({ socket })
    this.sessions.set(session.id, session);
    return session;
  }

  close(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(session.id);

      if (session.socket.readyState === WebSocket.OPEN) {
        session.socket.close();
      }
    }
  }

  set(session: Session) {
    this.sessions.set(session.id, session);
  }

  get(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  remove(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  all() {
    return Array.from(this.sessions.values());
  }

  count() {
    return this.sessions.size;
  }

  clear() {
    this.sessions.clear();
  }

}

const sessionsService = new SessionsService();
export { sessionsService };

