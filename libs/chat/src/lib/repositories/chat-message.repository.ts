import { RepositoryHelper } from "@cognum/helpers";
import { IChatMessage } from "@cognum/interfaces";
import { ChatMessage } from "../models";
''
export class ChatMessageRepository extends RepositoryHelper<IChatMessage> {
  constructor(userId?: string) {
    super(ChatMessage, userId);
  }
}
