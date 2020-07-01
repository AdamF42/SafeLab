const arima = require('arima')

export class Arima {

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

    async makePrediction(timeSeries: Array<number>): Promise<Array<number>> {
        if (timeSeries.length == 0) {
            console.log("No values to do prediction");
            return Promise.resolve([]);
        } else {
            const [pred, err] = arima(timeSeries, this.pointToForecast, {
                method: 0,
                optimizer: 6,
                p: this.pArima,
                q: this.qArima, 
                d: this.dArima,
                verbose: false
            })
            return Promise.resolve(pred); 
        }
    }
}