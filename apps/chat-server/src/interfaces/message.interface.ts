export interface IMessage {
<<<<<<< HEAD
  type: 'auth' | 'message' | 'newToken' | 'connection' | 'handleLLMNewToken' | 'handleChainEnd' | 'handleLLMNewTokenChatName' | 'handleEndChatName' | 'handleMessage';
=======
  type: 'auth' | 'message' | 'newToken' | 'connection' | 'handleLLMNewToken' | 'handleChainEnd' | 'handleLLMNewTokenChatName' | 'handleEndChatName';
>>>>>>> 1947452df40a20cd9147c59280a3418e3a469cbe
  content: any;
}
