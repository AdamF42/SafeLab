import { ReaderFromInflux } from './reader/reader';
import { WriterToInflux } from './writer/writer'
import { INFLUX_URL, TOKEN, ORG, BUCKET } from './config/constants';
import { InfluxDB } from '@influxdata/influxdb-client'
import { Arima } from './prediction/predictors/time-series-forecasters'
import { Predictor } from './prediction/predictor'
import { interval } from 'rxjs';
import { Persister } from './persister/persister_influx';
import {map} from 'rxjs/operators'

const NUM_POINTS_TO_FORECAST = 5;
const DISTANCE_BETWEEN_POINTS = 30; //minuti tra un punto e il successivo
const NUM_POINT_TO_READ = "1h";
const P_ARIMA = 2;
const D_ARIMA = 2;
const Q_ARIMA = 2;


const fluxQuery =
    `from(bucket: "${BUCKET}")
    |> range(start: -${NUM_POINT_TO_READ}, stop: now())
    |> filter(fn: (r) => r._measurement == "temperature")
    |> toFloat()
    |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`


// var url: string = INFLUX_URL;
// var token: string = TOKEN;
// const influxDB = new InfluxDB({url, token});
// const reader = new ReaderFromInflux(influxDB, ORG);
// const writer = new WriterToInflux(influxDB, ORG, BUCKET);
const arima = new Arima(NUM_POINTS_TO_FORECAST, P_ARIMA, D_ARIMA, Q_ARIMA);

const persister = new Persister(INFLUX_URL,TOKEN,ORG,BUCKET);

interval(DISTANCE_BETWEEN_POINTS * 60 * 1 /* ms */)
.pipe(map(async () => {return await persister.getLastData(fluxQuery)}))
.subscribe(
    async (result) => {
        // let result = await persister.getLastData(fluxQuery);
        let predictions = arima.makePrediction(await result);
        
        (await predictions).forEach(val => persister.writeData("", "Temperature Prevision", val));


        // reader.iterOnReadElement(fluxQuery, new Predictor(DISTANCE_BETWEEN_POINTS, arima, writer));
    },
    (err) => {
        console.log('Error: ' + err);
    });