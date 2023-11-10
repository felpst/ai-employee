import { Agent } from '@cognum/ai-employee';
import { IAIEmployee, IChatMessage, IChatRoom, IUser } from '@cognum/interfaces';
import { WebSocket } from 'ws';
import { IMessage } from '../../interfaces/message.interface';
import { sessionsService } from '../../services/sessions.service';
import { ConnectionClose } from './connection-close.usecase';
import { ConnectionConfirm } from './connection-confirm';
import { MessageSend } from './message-send.usecase';
import { SessionClose } from './session-close.usecase';
import { SessionCreate } from './session-create.usecase';

export class Connection {
  private _sessionId: string;

  constructor(
    public sessionCreate: SessionCreate,
    public sessionClose: SessionClose,
    public connectionConfirm: ConnectionConfirm,
    public connectionClose: ConnectionClose,
    public messageSend: MessageSend
  ) { }

  async execute() {
    try {
      this._sessionId = this.sessionCreate.execute().id;

      // Listeners
      this.session.socket.onerror = (error) => {
        this.connectionClose.execute(this, error.message);
      };
      this.session.socket.onclose = () => {
        this.sessionClose.execute(this._sessionId);
      };

      return this.session;
    } catch (error) {
      this.close(error.message);
    }
  }

  get session() {
    const session = sessionsService.get(this._sessionId);
    if (!session || session.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Session not found');
    }
    return session;
  }

  setUser(user: IUser) {
    this.session.user = user;
    sessionsService.set(this.session);
  }

  setChatRoom(chatRoom: IChatRoom) {
    this.session.chatRoom = chatRoom;
    sessionsService.set(this.session);
  }

  setChatMessages(chatMessages: IChatMessage[]) {
    this.session.chatMessages = chatMessages;
    sessionsService.set(this.session);
  }

  setSenders(senders: (IUser | IAIEmployee)[]) {
    this.session.senders = senders;
    sessionsService.set(this.session);
  }

  setAIEmployee(aiEmployee: IAIEmployee) {
    this.session.aiEmployee = aiEmployee;
    sessionsService.set(this.session);
  }

  setAgent(agent: Agent) {
    this.session.agent = agent;
    sessionsService.set(this.session);
  }

  send(message: IMessage) {
    this.messageSend.execute(this, message);
  }

  close(message: string) {
    this.connectionClose.execute(this, message);
  }

  confirm() {
    this.connectionConfirm.execute(this);
  }
}
