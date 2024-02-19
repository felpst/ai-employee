import { DynamicStructuredTool, Tool } from "@langchain/core/tools";
import { GoogleCalendarCreateEventTool } from "./google-calendar-create-event.tool";
import { GoogleCalendarDeleteEventTool } from "./google-calendar-delete-event.tool";
import { GoogleCalendarListEventsTool } from "./google-calendar-list-events.tool";
import { GoogleCalendarSeachEventsTool } from "./google-calendar-search-events.tool";
import { GoogleCalendarUpdateEventTool } from "./google-calendar-update-event.tool";
import { GoogleCalendarToolkitSettings } from "./google-calendar.interfaces";

export function GoogleCalendarToolkit(settings: GoogleCalendarToolkitSettings): (DynamicStructuredTool[] | Tool[]) {
  const tools = [];
  if (settings.tools.list) {
    tools.push(new GoogleCalendarListEventsTool(settings));
    tools.push(new GoogleCalendarSeachEventsTool(settings));
  }
  if (settings.tools.create) {
    tools.push(new GoogleCalendarCreateEventTool(settings));
  }
  if (settings.tools.update) {
    tools.push(new GoogleCalendarUpdateEventTool(settings));
  }
  if (settings.tools.delete) {
    tools.push(new GoogleCalendarDeleteEventTool(settings));
  }
  return tools;
}
