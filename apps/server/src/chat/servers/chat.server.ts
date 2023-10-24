import { AIEmployee } from '@cognum/ai-employee';
import { IChat, IMessage, IUser } from '@cognum/interfaces';
import { Chat, User } from '@cognum/models';
import express from 'express';
import { Server as HTTPServer, IncomingMessage, createServer } from 'http';
import jwt from 'jsonwebtoken';
import { Callbacks } from 'langchain/callbacks';
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { Adam } from '../agents/adam';

export interface WebSocketSession {
  id: string;
  webSocket: WebSocket;
  user: IUser;
  chat: IChat;
  aiEmployee: AIEmployee;
}

export interface WebSocketMessage {
  type: 'auth' | 'message' | 'newToken' | 'connection';
  content: any;
}

export class ChatServer {
  private sessions = new Map<string, WebSocketSession>();

  private app = express();
  private port = process.env.PORT_CHAT || 8080;

  private httpServer: HTTPServer;
  private webSocketServer: WebSocketServer;

  constructor() {
    this.httpServer = createServer(this.app);
    this.webSocketServer = new WebSocketServer({
      server: this.httpServer,
    });
  }

  private send(sessionId: string, data: WebSocketMessage) {
    const client = this.sessions.get(sessionId);
    if (client && client.webSocket.readyState === WebSocket.OPEN) {
      client.webSocket.send(JSON.stringify(data));
    }
  }

  private onMessage(context: {
    sessionId: string;
    webSocket: WebSocket;
    request: IncomingMessage;
  }) {
    return (event: any) => {
      const data: WebSocketMessage = JSON.parse(event.toString());
      this.onMessageType[data.type](context, data.content);
    };
  }

  private get onMessageType() {
    return {
      auth: (
        context: {
          sessionId: string;
          webSocket: WebSocket;
          request: IncomingMessage;
        },
        data: any
      ) => {
        const { token } = data;
        if (token) {
          const decodedToken: any = jwt.verify(
            token,
            process.env.AUTH_SECRET_KEY
          );
          if (!decodedToken) {
            this.webSocketServer.close();
            return;
          }

          // Set user id
          const { userId } = decodedToken;
          const session = this.sessions.get(context.sessionId);
          if (session) {
            User.findById(userId)
              .then(async (user) => {
                // Set user
                const session = this.sessions.get(context.sessionId);
                session.user = user;
                this.sessions.set(context.sessionId, session);

                // TODO Check permission to access chat

                const callbacks: Callbacks = [
                  {
                    handleLLMNewToken: (token: string) => {
                      this.send(context.sessionId, {
                        type: 'newToken',
                        content: {
                          type: 'message',
                          token,
                        },
                      });
                    },
                  },
                ];

                // Initiate AI Employee: Adam
                const aiEmployee = new Adam({
                  chat: session.chat,
                  user,
                  callbacks,
                });
                session.aiEmployee = aiEmployee;
                this.sessions.set(context.sessionId, session);

                // Load chat messages
                await aiEmployee.memory.loadAllMessages();
                const messages = await aiEmployee.chatHistory();

                // Send
                this.send(context.sessionId, {
                  type: 'auth',
                  content: {
                    user,
                    aiEmployee: session.aiEmployee.getIdentity(),
                    chat: session.chat,
                    messages,
                  },
                });
              });
          }
        }
      },
      message: (
        context: {
          sessionId: string;
          webSocket: WebSocket;
          request: IncomingMessage;
        },
        messageContent: string
      ) => {
        try {
          const session = this.sessions.get(context.sessionId);
          if (!session) {
            throw new Error('Session not found');
          }

          console.log(`Message from ${session.user.name}:`, messageContent);

          // Send message to AI Employee
          const aiEmployee = session.aiEmployee;

          aiEmployee.call(messageContent, {
            onSaveHumanMessage: (message: IMessage) => {
              this.send(context.sessionId, {
                type: 'message',
                content: message,
              });
            },
            onSaveAIMessage: (message: IMessage) => {
              this.send(context.sessionId, {
                type: 'message',
                content: message,
              });
            },
            handleLLMNewTokenChatName: (token: string) => {
              this.send(context.sessionId, {
                type: 'newToken',
                content: {
                  type: 'chatName',
                  token,
                },
              });
            },
          });
        } catch (error) {
          this.closeSession(context.sessionId, error.message);
        }
      },
      newToken: (
        context: {
          sessionId: string;
          webSocket: WebSocket;
          request: IncomingMessage;
        },
        data: any
      ) => {
        console.log('New token', data);
      },
      connection: (
        context: {
          sessionId: string;
          webSocket: WebSocket;
          request: IncomingMessage;
        },
        data: any
      ) => {
        console.log('Connection', data);
      },
    };
  }

  private onClose(context: { sessionId: string }) {
    return () => this.closeSession(context.sessionId);
  }

  private onError(error: any) {
    console.error('Error', error);
  }

  private connect() {
    this.webSocketServer.on('connection', async (webSocket, request) => {
      // Session ID
      const sessionId = uuidv4();

      try {
        console.log('Opened connection');

        // Set session
        this.sessions.set(sessionId, {
          id: sessionId,
          webSocket,
          user: null,
          chat: null,
          aiEmployee: null,
        });

        // Load Chat
        const location = url.parse(request.url, true);
        const chatId = location.query.chatId as string;
        if (!chatId) {
          throw new Error('Chat ID not found');
        }
        const chat = await Chat.findById(chatId)
        if (!chat) {
          throw new Error('Chat not exists');
        }

        // Set chat
        const session = this.sessions.get(sessionId);
        session.chat = chat;
        this.sessions.set(sessionId, session);

        // Listeners
        webSocket.on(
          'message',
          this.onMessage({ sessionId, webSocket, request }).bind(this)
        );
        webSocket.on('close', this.onClose({ sessionId }).bind(this));
        webSocket.on('error', this.onError.bind(this));

        // Confirm connection
        this.send(sessionId, {
          type: 'connection',
          content: { sessionId, isConnected: true },
        });
      } catch (error) {
        console.log('[connect error]', error);
        this.closeSession(sessionId, error.message);
      }
    });
  }

  closeSession(sessionId: string, message?: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.send(sessionId, {
        type: 'connection',
        content: { sessionId, isConnected: false, message },
      });
      session.webSocket.close();
      this.sessions.delete(sessionId);
    }
  }

  run() {
    this.connect();
    this.httpServer.listen(this.port, () => {
      console.log(`Chat server listing on port: ${this.port}`);
    });
  }
}
