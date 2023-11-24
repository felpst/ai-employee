import { IPerson } from "./person.entitie";

export function structInfos(persons: IPerson[]): IPerson[] {
    return persons.map((person) => {
        return {
            name: person.name,
            title: person.title,
            location: person.location,
            current: person.current,
        };
    });
}

const personOne: IPerson = {
    name: 'name',
    title: 'title',
    location: 'location',
    current: 'current'
}

const personTwo: IPerson = {
    name: 'name2',
    title: 'title2',
    location: 'location2',
    current: 'current2'
}

const personThree: IPerson = {
    name: 'name3',
    title: 'title3',
    location: 'location3',
    current: 'current3'
}

const persons: IPerson[] = [personOne, personTwo, personThree];

console.log(persons);

console.log(structInfos(persons));