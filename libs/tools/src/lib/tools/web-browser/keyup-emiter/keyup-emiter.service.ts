import * as ks from 'node-key-sender';
import { accentsMap } from './keyup-emiter.interface';

export class KeyUpService {
  constructor() {
    const ks = require('node-key-sender');
    ks.aggregateKeyboardLayout(accentsMap);
  }

  async press(key: string, combination?: string[]): Promise<string> {
    if (combination) {
      combination.push(key);
      return ks.sendKeys(combination).then(
        () => {
          return `Keys ${combination} pressed`;
        },
        (error) => {
          return error.message;
        }
      );
    }

    return ks.sendKey(key).then(
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
