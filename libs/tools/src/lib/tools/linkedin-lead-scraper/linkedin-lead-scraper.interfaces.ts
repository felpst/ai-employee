export interface LinkedInLeadScraperToolSettings {
  username: string;
  password: string;
}

export interface IPerson {
  name: string;
  title: string;
  location: string;
  profileLink?: string;
  current?: string;
}

export class Person implements IPerson {
  name: string;
  title: string;
  location: string;
  profileLink?: string;
  constructor(
    name: string,
    title: string,
    location: string,
    profileLink?: string,
  ) {
    this.name = name;
    this.title = title;
    this.location = location;
    this.profileLink = profileLink;
  };
};
