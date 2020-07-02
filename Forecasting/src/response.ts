
export class ReaderResponse {
    private _time: Date;
    private _value: number;
    private _field: string;
    private _measurement: string;

    constructor(time: Date, value: number, field: string, measurement: string){
        this._time = time;
        this._value = value;
        this._field = field;
        this._measurement = measurement;
    }

    get value(){
        return this._value;
    }

    get measurement(){
        return this._measurement;
    }
}