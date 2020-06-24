export class PeopleCount  {
    private _location: string;
    private _people: number;

    constructor(location: string, people: number) {
        this._location=location;
        this._people=people;
    }

    get location() {
        return this._location;
    }

    get people() {
        return this._people;
    }
}