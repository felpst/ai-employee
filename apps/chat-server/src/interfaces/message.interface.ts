export interface IMessage {
  type: 'auth' | 'message' | 'newToken' | 'connection' | 'handleLLMNewToken' | 'handleChainEnd' | 'handleLLMNewTokenChatName' | 'handleEndChatName' | 'handleMessage';
  content: any;
}
