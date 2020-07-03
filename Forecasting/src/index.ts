import { INFLUX_URL, INFLUX_TOKEN, ORG, BUCKET } from './config/constants';
import { Arima } from './prediction/predictors/time-series-forecasters'
import { interval } from 'rxjs';
import { Persister } from './persister/persister_influx';
import {map} from 'rxjs/operators'

const NUM_POINTS_TO_FORECAST = 1;
const DISTANCE_BETWEEN_POINTS = 30; 
const NUM_POINT_TO_READ = "12h";
const P_ARIMA = 2;
const D_ARIMA = 2;
const Q_ARIMA = 2;

const arima = new Arima(NUM_POINTS_TO_FORECAST, P_ARIMA, D_ARIMA, Q_ARIMA);

const persister = new Persister(INFLUX_URL,INFLUX_TOKEN,ORG,BUCKET);

function makeQuery(measurement: string):string {
    return `from(bucket: "${BUCKET}")
    |> range(start: -${NUM_POINT_TO_READ}, stop: now())
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> toFloat()
    |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`;
}

function forecast(query:string, saved_name:string) {
    interval(DISTANCE_BETWEEN_POINTS * 60 * 1000 /* ms */)
        .pipe(map(async () => { return await persister.getLastData(query); }))
        .subscribe(async (result) => {
            let predictions = arima.makePrediction(await result);
            (await predictions)
                .forEach(val => {
                    console.log(val);
                    persister.writeData(new Date(Date.now() + DISTANCE_BETWEEN_POINTS), saved_name, val);
                });
        }, (err) => {
            console.log('Error: ' + err);
        });
}

["temperature", "humidity"]
.forEach(measurement => forecast(makeQuery(measurement), `${measurement}_prevision`));