import { ILinkedInAuth } from "../linkedin.interfaces";

export interface ILinkedInToolSettings {
  auth: ILinkedInAuth;
  tools: {
    findLeads: boolean;
  }
}
