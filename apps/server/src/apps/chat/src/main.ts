import { DatabaseHelper } from '@cognum/helpers';
import 'dotenv/config';
import { ChatServer } from './servers/chat.server';

DatabaseHelper.connect().then(() => {
  const chatServer = new ChatServer();
  chatServer.run();
});
