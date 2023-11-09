import { ChatRoom } from "../entities/ChatRoom";
import { IMessage } from "../entities/Message";
import { IChatRoomRepository } from "../repositories/ChatRoomRepository";

interface CreateChatRoomRequest {
  id: string;
  name: string;
  workspace: string;
}

interface CreatechatRoomResponse {
  id: string;
  name: string;
  messages: IMessage[];
  workspace: string;
}

export class CreateChatRoom {
  private chatRoomRepository: IChatRoomRepository;

  constructor(chatRoomRepository: IChatRoomRepository) {
    this.chatRoomRepository = chatRoomRepository;
  }

  async execute(request: CreateChatRoomRequest): Promise<CreatechatRoomResponse> {

    // Check if chat room already exists
    const chatRoomAlreadyExists = await this.chatRoomRepository.findById(request.id);
    if (chatRoomAlreadyExists) {
      throw new Error('Chat room already exists');
    }

    // Create new chat room entity
    const chat = new ChatRoom(request);

    // Save chat room
    const savedChat = await this.chatRoomRepository.create(chat);

    return {
      id: savedChat.id.toString(),
      name: savedChat.name,
      messages: savedChat.messages ? savedChat.messages.map(msg => {
        return {
          id: msg.id.toString(),
          content: msg.content,
          senderId: msg.senderId.toString(),
          chatRoomId: msg.chatRoomId.toString(),
          timestamp: msg.timestamp
        };
      }) : undefined,
      workspace: savedChat.workspace.toString()
    };
  }
}
