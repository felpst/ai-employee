import { RepositoryHelper } from "@cognum/helpers";
import { IChatRoom } from "@cognum/interfaces";
import { ChatRoom } from "../models";

export class ChatRoomRepository extends RepositoryHelper<IChatRoom> {
  constructor() {
    super(ChatRoom);
  }
}
