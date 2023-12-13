import * as ks from 'node-key-sender';
import { accentsMap, Key } from './keyup-emiter.interface';

export class KeyUpService {
  constructor() {
    const ks = require('node-key-sender');
    ks.aggregateKeyboardLayout(accentsMap);
  }

  async press(key: string): Promise<string> {
    const keyCode = Key[key];
    return ks.sendKey(keyCode).then(
      () => {
        return `Key ${key} pressed`;
      },
      (error) => {
        return error.message;
      }
    );
  }

  async typeMessage(text: string): Promise<string> {
    return ks.sendText(text).then(
      () => {
        return `Text ${text} typed`;
      },
      (error) => {
        return error.message;
      }
    );
  }
}
