import { ChatRoomDTO } from "../entities/ChatRoom";
import { IMessage } from "../entities/Message";
import { IChatRoomRepository } from "../repositories/ChatRoomRepository";

interface UpdateChatRommRequest {
  name?: string;
  workspace?: string;
}

interface UpdateChatRommResponse {
  id: string;
  name: string;
  messages: IMessage[];
  workspace: string;
}

export class UpdateChatRoom {
  private chatRommRepository: IChatRoomRepository;

  constructor(chatRommRepository: IChatRoomRepository) {
    this.chatRommRepository = chatRommRepository;
  }

  async execute(id: string, request: UpdateChatRommRequest): Promise<UpdateChatRommResponse> {

    // Update new chat room entity
    const chat = new ChatRoomDTO(request);

    // Save chat room
    const savedChat = await this.chatRommRepository.update(id, chat);

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
