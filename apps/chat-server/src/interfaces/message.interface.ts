export interface IMessage {
  type: 'auth' | 'message' | 'newToken' | 'connection' | 'handleLLMNewToken' | 'handleChainEnd' | 'handleLLMNewTokenChatName' | 'handleEndChatName' | 'call-progress';
  content: any;
}
