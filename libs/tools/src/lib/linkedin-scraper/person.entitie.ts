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
    current?: string;
    constructor(
        name: string,
        title: string,
        location: string,
        profileLink?: string,
        current?: string
    ) {
        this.name = name;
        this.title = title;
        this.location = location;
        this.profileLink = profileLink;
        this.current = current;
    }

}

const person = new Person('name', 'title', 'location', 'current');
console.log(person);