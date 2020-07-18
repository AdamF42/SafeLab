export class Prediction {

    private _temperature: Map<Date, Number>;
    private _humidity: Map<Date, Number>;
    private _pressure: Map<Date, Number>;

    constructor(temperature: Map<Date, Number>, humidity: Map<Date, Number>, pressure: Map<Date, Number>){
        this._temperature = temperature;
        this._humidity = humidity;
        this._pressure = pressure;
    }

    get temperature() {
        return this._temperature;
    } 

    get humidity() {
        return this._humidity;
    }

    get pressure() {
        return this._pressure;
    }
}