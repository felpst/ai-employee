import { DynamicStructuredTool, Tool } from "@langchain/core/tools";
import { MailReadTool } from "./mail-read.tool";
import { MailSendTool } from "./mail-send.tool";
import { MailToolSettings } from "./mail.interfaces";

export function MailToolkit(settings: MailToolSettings): DynamicStructuredTool[] | Tool[] {
  return [
    new MailSendTool(settings),
    new MailReadTool(settings)
  ];
}
