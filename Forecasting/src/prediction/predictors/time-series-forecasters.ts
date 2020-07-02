const arima = require('arima')

export interface TimeSeriesForecaster {
    makePrediction<T>(input:Array<T>): Promise<Array<T>>;
}

export class Arima implements TimeSeriesForecaster{

    private pointToForecast: number;
    private pArima: number;
    private dArima: number;
    private qArima: number;

    constructor(pointToForecast: number, pArima: number, dArima: number, qArima: number){
        this.pointToForecast = pointToForecast;
        this.pArima = pArima;
        this.dArima = dArima;
        this.qArima = qArima;
    }
    async makePrediction<T>(input: T[]): Promise<T[]> {
        if (input.length == 0) {
            console.log("No values to do prediction");
            return Promise.resolve([]);
        } else {
            console.log(input);
            
            const [pred, err] = arima(input, this.pointToForecast, {
                method: 0,
                optimizer: 6,
                p: this.pArima,
                q: this.qArima, 
                d: this.dArima,
                verbose: false
            })
            console.log("End arima");
            return Promise.resolve(pred); 
        }
    }
}