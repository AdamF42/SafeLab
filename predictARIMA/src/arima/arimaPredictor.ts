const arima = require('arima')

export class Predictor {
    pointToForecast: number;
    pArima: number;
    dArima: number;
    qArima: number;

    constructor(pointToForecast: number, pArima: number, dArima: number, qArima: number){
        this.pointToForecast = pointToForecast;
        this.pArima = pArima;
        this.dArima = dArima;
        this.qArima = qArima;
    }

    predict(timeSeries: Array<number>) {
        console.log("history" + timeSeries);
        var predict = arima(timeSeries, this.pointToForecast, {
            method: 0, optimizer: 6, p: this.pArima, d: this.dArima, q: this.qArima, verbose: false 	
        });
        return predict;
    }
}