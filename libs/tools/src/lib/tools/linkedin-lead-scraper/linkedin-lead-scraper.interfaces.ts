export interface LinkedInLeadScraperToolSettings {
  user: string;
  password: string;
}

export interface ILead {
  name: string;
  title: string;
  location: string;
  profileLink?: string;
  current?: string;
}
