export class ReaderResponse {
    private _result: string;
    private _table: string;
    private field: string;
    private measurement: string;
    private start:string;
    private stop: string;
    private _device: string;
    private _location: string;
    private value: number;
    private time: string;


    constructor(
        result: string, 
        table: string, 
        _field:string,
        _measurement:string,
        _start:string,
        _stop:string,
        device: string, 
        location: string,
        _value:number,
        _time:string
        ){
        this._result = result;
        this._table = table;
        this.field = _field;
        this.measurement=_measurement;
        this.start = _start;
        this.stop = _stop;
        this._device = device;
        this._location = location;
        this.value = _value;
        this.time = _time
    }

    get _measurement() {
        return this.measurement;
    }

    get _value(){
        return this.value;
    }

}