export interface IMessage {
  type: 'auth' | 'message' | 'newToken' | 'connection';
  content: any;
}
