import { IChatRoom } from "../../../../interfaces/src/chats";
import { ChatRoom } from "../models";
import { ChatRoomRepository } from "../repositories";

export class ChatRoomCreate {

  constructor(
    private chatRoomRepository: ChatRoomRepository
  ) { }

  async execute(data: IChatRoom) {
    return this.chatRoomRepository.create(new ChatRoom(data));
  }
}
