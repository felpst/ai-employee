import { IUser } from "@cognum/interfaces";

export interface GoogleCalendarToolkitSettings {
  token: string;
  user: Partial<IUser>;
  tools: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  },
}
