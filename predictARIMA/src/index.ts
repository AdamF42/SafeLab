import { ReaderFromInflux } from './reader/reader';
import { WriterToInflux } from './writer/writer'
import { INFLUX_URL, TOKEN, ORG, BUCKET } from './config/constants';
import { InfluxDB } from '@influxdata/influxdb-client'
import { Arima } from './prediction/arimaPredictor'
import { Predictor } from './prediction/predict'
import { interval } from 'rxjs';

const NUM_POINTS_TO_FORECAST = 5;
const DISTANCE_BETWEEN_POINTS = 1; //minuti tra un punto e il successivo
const NUM_POINT_TO_READ = "1h";
const P_ARIMA = 2;
const D_ARIMA = 2;
const Q_ARIMA = 2;


const fluxQuery =
    `from(bucket: "${BUCKET}")
    |> range(start: -${NUM_POINT_TO_READ}, stop: now())
    |> filter(fn: (r) => r._measurement == "temp")
    |> toFloat()
    |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`


var url: string = INFLUX_URL;
var token: string = TOKEN;
const influxDB = new InfluxDB({url, token});
const reader = new ReaderFromInflux(influxDB, ORG);
const writer = new WriterToInflux(influxDB, ORG, BUCKET);
const arima = new Arima(NUM_POINTS_TO_FORECAST, P_ARIMA, D_ARIMA, Q_ARIMA);

// reader.iterOnReadElement(fluxQuery, new Predictor(DISTANCE_BETWEEN_POINTS, arima, writer));

interval(DISTANCE_BETWEEN_POINTS * 60 * 100 /* ms */)
.subscribe(
    () => {
        reader.iterOnReadElement(fluxQuery, new Predictor(DISTANCE_BETWEEN_POINTS, arima, writer));
    },
    (err) => {
        console.log('Error: ' + err);
    });